// ============================================================
//  ARAS — Phase 6: Full Risk Score Engine
//  Board   : ESP32
//  Sensors : MPU6050 + MAX30102 + NEO-6M + Button + Buzzer
//  This is the core intelligence of ARAS
// ============================================================

#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_SSD1306.h>
#include <TinyGPSPlus.h>
#include <MAX30105.h>
#include <heartRate.h>
#include <math.h>

// ── OLED ────────────────────────────────────────────────────
#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT  64
#define OLED_RESET     -1
#define OLED_ADDRESS  0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// ── MPU6050 ─────────────────────────────────────────────────
Adafruit_MPU6050 mpu;

// ── GPS ─────────────────────────────────────────────────────
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);
#define GPS_RX_PIN 16
#define GPS_TX_PIN 17
#define GPS_BAUD   9600

// ── MAX30102 ────────────────────────────────────────────────
MAX30105 particleSensor;
const byte HR_SAMPLE_SIZE = 4;
byte  hrRates[HR_SAMPLE_SIZE];
byte  hrRateSpot  = 0;
long  lastBeat    = 0;
float beatsPerMinute = 0;
int   beatAvg     = 0;
int   spo2        = 0;
bool  fingerDetected = false;

// ── Button + Buzzer ─────────────────────────────────────────
#define BUTTON_PIN 4
#define BUZZER_PIN 5
bool panicPressed    = false;
bool lastButtonState = HIGH;
unsigned long lastDebounce = 0;
const int DEBOUNCE_DELAY   = 50;

// ── Motion thresholds ────────────────────────────────────────
const float FALL_THRESHOLD   = 2.5;
const float IMPACT_THRESHOLD = 15.0;
const float MOTION_THRESHOLD = 1.5;

// ── Vital thresholds ─────────────────────────────────────────
const int HR_CRITICAL_HIGH = 130;
const int HR_HIGH          = 110;
const int HR_LOW           = 50;
const int HR_CRITICAL_LOW  = 40;
const int SPO2_CRITICAL    = 90;
const int SPO2_LOW         = 94;

// ── Risk engine state ────────────────────────────────────────
String motionState     = "STILL";
bool   fallDetected    = false;
bool   impactDetected  = false;
int    riskScore       = 0;
float  totalGyro       = 0;  
int    prevRiskScore   = 0;
String riskLevel       = "LOW";
String alertReason     = "";

// ── Confidence window ────────────────────────────────────────
// Score must stay >= threshold for CONFIRM_WINDOW ms
// before alert fires — prevents false positives
const int  CONFIRM_WINDOW   = 5000;
const int  HIGH_RISK_THRESH = 70;
unsigned long highRiskSince = 0;
bool     highRiskConfirmed  = false;

// ── Cancel window ────────────────────────────────────────────
// After alert triggers, user has CANCEL_WINDOW ms to press
// button and cancel before external alert goes out
const int  CANCEL_WINDOW    = 10000;
bool       alertPending     = false;
unsigned long alertPendingSince = 0;

// ── GPS speed tracking ───────────────────────────────────────
float prevSpeed        = 0;
bool  suddenStop       = false;

// ── Display pages ────────────────────────────────────────────
int  currentPage       = 0;
unsigned long lastPageSwitch = 0;
const int PAGE_INTERVAL = 3000;

// ── Timing ───────────────────────────────────────────────────
unsigned long lastUpdate = 0;
const int UPDATE_INTERVAL = 250;

// ============================================================
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("========================================");
  Serial.println("  ARAS Phase 6 — Risk Score Engine");
  Serial.println("========================================");

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println("[ERROR] OLED not found!");
    while (1) delay(500);
  }
  showSplashScreen();
  Serial.println("[OK] OLED ready");

  // MPU6050
  if (!mpu.begin()) {
    Serial.println("[ERROR] MPU6050 not found!");
    showErrorScreen("MPU6050", "not found!");
    while (1) delay(500);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.println("[OK] MPU6050 ready");

  // MAX30102
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("[ERROR] MAX30102 not found!");
    showErrorScreen("MAX30102", "not found!");
    while (1) delay(500);
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
  Serial.println("[OK] MAX30102 ready");

  // GPS
  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  Serial.println("[OK] GPS UART ready");

  // Startup beeps — 2 short = ready
  beep(100); delay(100); beep(100);
  Serial.println("[OK] All systems ready");
  Serial.println("========================================\n");
  delay(2000);
}

// ============================================================
void loop() {

  // ── GPS feed ─────────────────────────────────────────────
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // ── MPU6050 ──────────────────────────────────────────────
  sensors_event_t accel, gyro, temp;
  mpu.getEvent(&accel, &gyro, &temp);
  float ax = accel.acceleration.x;
  float ay = accel.acceleration.y;
  float az = accel.acceleration.z;
  float totalAccel = sqrt(ax*ax + ay*ay + az*az) / 9.81;
  float gx = gyro.gyro.x;
  float gy = gyro.gyro.y;
  float gz = gyro.gyro.z;
  totalGyro = sqrt(gx*gx + gy*gy + gz*gz);

  // ── Motion state ─────────────────────────────────────────
  impactDetected = false;
  if (totalAccel < FALL_THRESHOLD) {
    fallDetected = true;
    motionState  = "FREE-FALL";
  } else if (fallDetected && totalAccel > IMPACT_THRESHOLD) {
    fallDetected   = false;
    impactDetected = true;
    motionState    = "IMPACT!";
  } else if (totalAccel > MOTION_THRESHOLD) {
    motionState = "MOVING";
    fallDetected = false;
  } else {
    motionState  = "STILL";
    fallDetected = false;
  }

  // ── GPS sudden stop detection ─────────────────────────────
  if (gps.speed.isValid()) {
    float currentSpeed = gps.speed.kmph();
    suddenStop = (prevSpeed > 20.0 && currentSpeed < 5.0);
    prevSpeed  = currentSpeed;
  }

  // ── MAX30102 ─────────────────────────────────────────────
  long irValue = particleSensor.getIR();
  fingerDetected = (irValue > 50000);
  if (fingerDetected) {
    if (checkForBeat(irValue)) {
      long delta = millis() - lastBeat;
      lastBeat   = millis();
      beatsPerMinute = 60.0 / (delta / 1000.0);
      if (beatsPerMinute > 20 && beatsPerMinute < 255) {
        hrRates[hrRateSpot++] = (byte)beatsPerMinute;
        hrRateSpot %= HR_SAMPLE_SIZE;
        beatAvg = 0;
        for (byte x = 0; x < HR_SAMPLE_SIZE; x++) beatAvg += hrRates[x];
        beatAvg /= HR_SAMPLE_SIZE;
      }
    }
    long redValue = particleSensor.getRed();
    if (irValue > 0) {
      float ratio = (float)redValue / (float)irValue;
      spo2 = constrain((int)(110.0 - 25.0 * ratio), 85, 100);
    }
  } else {
    beatAvg = 0;
    spo2    = 0;
  }

  // ── Button debounce ──────────────────────────────────────
  bool currentButtonState = digitalRead(BUTTON_PIN);
  if (currentButtonState != lastButtonState) lastDebounce = millis();
  if ((millis() - lastDebounce) > DEBOUNCE_DELAY) {
    if (currentButtonState == LOW && lastButtonState == HIGH) {
      if (alertPending) {
        // Cancel pending alert
        alertPending = false;
        Serial.println("*** ALERT CANCELLED BY USER ***");
        beep(50); delay(50); beep(50);
      } else {
        // Trigger panic
        panicPressed = true;
        Serial.println("*** PANIC BUTTON PRESSED ***");
      }
    }
  }
  lastButtonState = currentButtonState;

  // ── CORE RISK SCORE ENGINE ────────────────────────────────
  riskScore = calculateRisk(totalAccel, totalGyro);

  // ── Risk level classification ─────────────────────────────
  if      (riskScore >= 90) riskLevel = "CRITICAL";
  else if (riskScore >= 70) riskLevel = "HIGH";
  else if (riskScore >= 41) riskLevel = "MEDIUM";
  else                      riskLevel = "LOW";

  // ── Confidence window check ───────────────────────────────
  if (riskScore >= HIGH_RISK_THRESH) {
    if (highRiskSince == 0) highRiskSince = millis();
    if ((millis() - highRiskSince) >= CONFIRM_WINDOW) {
      highRiskConfirmed = true;
    }
  } else {
    highRiskSince     = 0;
    highRiskConfirmed = false;
  }

  // ── Alert trigger ─────────────────────────────────────────
  if ((highRiskConfirmed || panicPressed) && !alertPending) {
    alertPending      = true;
    alertPendingSince = millis();
    highRiskConfirmed = false;
    panicPressed      = false;
    Serial.println("*** ALERT PENDING — press button within 10s to cancel ***");
    showCancelScreen();
    // Warning beep pattern
    for (int i = 0; i < 2; i++) { beep(200); delay(200); }
  }

  // ── Cancel window expired → fire alert ───────────────────
  if (alertPending && (millis() - alertPendingSince) >= CANCEL_WINDOW) {
    alertPending = false;
    fireAlert();
  }

  // ── Update display + serial ──────────────────────────────
  if (millis() - lastUpdate >= UPDATE_INTERVAL) {
    lastUpdate = millis();

    if (!alertPending) {
      if (millis() - lastPageSwitch >= PAGE_INTERVAL) {
        lastPageSwitch = millis();
        currentPage = (currentPage + 1) % 3;
      }
      switch (currentPage) {
        case 0: showMotionPage(totalAccel, totalGyro, temp.temperature); break;
        case 1: showVitalsPage(); break;
        case 2: showGPSPage();    break;
      }
    } else {
      // Show countdown during cancel window
      int remaining = CANCEL_WINDOW - (millis() - alertPendingSince);
      showCancelCountdown(remaining / 1000);
    }

    printSerialStatus(totalAccel, totalGyro);
  }

  delay(20);
}

// ============================================================
//  CORE RISK SCORE ENGINE
// ============================================================

int calculateRisk(float accel, float gyro) {
  int score      = 0;
  alertReason    = "";

  // ── Component 1: Motion (max 40 pts) ─────────────────────
  int motionScore = 0;
  if      (motionState == "IMPACT!")   motionScore = 40;
  else if (motionState == "FREE-FALL") motionScore = 30;
  else if (motionState == "MOVING")    motionScore = 15;
  else                                 motionScore = 0;

  // Gyro spike bonus — rapid rotation during movement
  if (totalGyro > 3.0 && motionState == "MOVING") motionScore += 5;

  score += motionScore;
  if (motionScore >= 30) alertReason += "Fall detected. ";

  // ── Component 2: Heart rate (max 20 pts) ─────────────────
  int hrScore = 0;
  if (fingerDetected && beatAvg > 0) {
    if      (beatAvg > HR_CRITICAL_HIGH) { hrScore = 20; alertReason += "HR critical high. "; }
    else if (beatAvg < HR_CRITICAL_LOW)  { hrScore = 20; alertReason += "HR critical low. ";  }
    else if (beatAvg > HR_HIGH)          { hrScore = 12; }
    else if (beatAvg < HR_LOW)           { hrScore = 15; alertReason += "HR low. "; }
  }
  score += hrScore;

  // ── Component 3: SpO2 (max 20 pts) ───────────────────────
  int spo2Score = 0;
  if (fingerDetected && spo2 > 0) {
    if      (spo2 < SPO2_CRITICAL) { spo2Score = 20; alertReason += "SpO2 critical. "; }
    else if (spo2 < SPO2_LOW)      { spo2Score = 10; alertReason += "SpO2 low. ";      }
  }
  score += spo2Score;

  // ── Component 4: GPS sudden stop (max 10 pts) ────────────
  if (suddenStop) { score += 10; alertReason += "Sudden stop. "; }

  // ── Component 5: Pattern bonus (max 15 pts) ──────────────
  // Fall + abnormal vitals = much higher risk than either alone
  bool vitalAbnormal = (fingerDetected && (beatAvg > HR_HIGH || beatAvg < HR_LOW || spo2 < SPO2_LOW));
  bool motionDanger  = (motionState == "IMPACT!" || motionState == "FREE-FALL");
  if (motionDanger && vitalAbnormal) {
    score += 15;
    alertReason += "Combined fall+vitals. ";
  }

  // ── Panic button override ─────────────────────────────────
  if (panicPressed) {
    score = max(score, 95);
    alertReason = "Manual panic trigger. ";
  }

  return constrain(score, 0, 100);
}

// ============================================================
//  ALERT FIRE
// ============================================================

void fireAlert() {
  Serial.println("========================================");
  Serial.println("***  ARAS ALERT FIRED  ***");
  Serial.print("Risk Score : "); Serial.println(riskScore);
  Serial.print("Level      : "); Serial.println(riskLevel);
  Serial.print("Reason     : "); Serial.println(alertReason);
  if (gps.location.isValid()) {
    Serial.print("Location   : ");
    Serial.print(gps.location.lat(), 6); Serial.print(", ");
    Serial.println(gps.location.lng(), 6);
  }
  Serial.println("Action     : CAM capture + GSM alert (Phase 7)");
  Serial.println("========================================");

  showAlertFiredScreen();

  // Critical alert beep pattern — 5 rapid beeps
  for (int i = 0; i < 5; i++) { beep(150); delay(100); }
}

// ============================================================
//  SERIAL STATUS
// ============================================================

void printSerialStatus(float accel, float gyro) {
  Serial.println("────────────────────────────────");
  Serial.print("Motion  : "); Serial.print(accel, 2);
  Serial.print("g  [");       Serial.print(motionState);
  Serial.println("]");
  Serial.print("Vitals  : HR="); Serial.print(beatAvg);
  Serial.print(" SpO2=");        Serial.print(spo2);
  Serial.println("%");
  Serial.print("Risk    : ");    Serial.print(riskScore);
  Serial.print("  Level: ");     Serial.println(riskLevel);
  if (highRiskSince > 0) {
    int elapsed = (millis() - highRiskSince) / 1000;
    Serial.print("Confirm : ");  Serial.print(elapsed);
    Serial.println("s / 5s");
  }
  if (alertReason != "") {
    Serial.print("Reason  : "); Serial.println(alertReason);
  }
}

// ============================================================
//  DISPLAY FUNCTIONS
// ============================================================

void showMotionPage(float accel, float gyro, float temp) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);

  // Risk score header with level indicator
  display.setCursor(0, 0);
  display.print("ARAS ["); display.print(riskLevel); display.print("]");
  display.setCursor(90, 0);
  display.setTextSize(riskScore >= 70 ? 2 : 1);
  display.print(riskScore);
  display.setTextSize(1);

  display.drawLine(0, 16, 128, 16, SSD1306_WHITE);
  display.setCursor(0, 20);
  display.print("Accel: "); display.print(accel, 2); display.print("g");
  display.setCursor(0, 32);
  display.print("Gyro : "); display.print(gyro, 2);
  display.setCursor(0, 44);
  display.print("Temp : "); display.print(temp, 1); display.print("C");
  display.drawLine(0, 54, 128, 54, SSD1306_WHITE);
  display.setCursor(0, 57);
  display.print(motionState);
  display.setCursor(104, 57);
  display.print("1/3");
  display.display();
}

void showVitalsPage() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("VITALS ["); display.print(riskLevel); display.print("]");
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);
  if (fingerDetected) {
    display.setCursor(0, 14);
    display.print("HR  :");
    display.setTextSize(2);
    display.setCursor(38, 12);
    display.print(beatAvg);
    display.setTextSize(1);
    display.print(" BPM");
    display.setCursor(0, 34);
    display.print("SpO2:");
    display.setTextSize(2);
    display.setCursor(38, 32);
    display.print(spo2);
    display.setTextSize(1);
    display.print(" %");
  } else {
    display.setCursor(14, 22);
    display.print("Place finger on");
    display.setCursor(22, 36);
    display.print("MAX30102...");
  }
  display.drawLine(0, 54, 128, 54, SSD1306_WHITE);
  display.setCursor(0, 57);
  display.print(fingerDetected ? "Reading" : "No finger");
  display.setCursor(104, 57);
  display.print("2/3");
  display.display();
}

void showGPSPage() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("GPS");
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);
  if (gps.location.isValid()) {
    display.setCursor(0, 14);
    display.print("LAT:"); display.print(gps.location.lat(), 4);
    display.setCursor(0, 26);
    display.print("LNG:"); display.print(gps.location.lng(), 4);
    display.setCursor(0, 38);
    display.print("Sats:"); display.print(gps.satellites.value());
    display.setCursor(0, 50);
    display.print("Spd:"); display.print(gps.speed.kmph(), 1); display.print("km/h");
  } else {
    display.setCursor(0, 18); display.print("Searching...");
    display.setCursor(0, 32); display.print("Sats: ");
    display.print(gps.satellites.isValid() ? gps.satellites.value() : 0);
    display.setCursor(0, 46); display.print("Go near window!");
  }
  display.setCursor(104, 57); display.print("3/3");
  display.display();
}

void showCancelScreen() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(20, 4);  display.print("!! ALERT !!");
  display.setCursor(0,  20); display.print("Risk: "); display.print(riskScore);
  display.setCursor(0,  32); display.print("Press BTN to cancel");
  display.setCursor(0,  44); display.print("10 seconds...");
  display.display();
}

void showCancelCountdown(int secondsLeft) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(20, 2);  display.print("!! ALERT !!");
  display.setCursor(0, 16);  display.print("Sending in:");
  display.setTextSize(3);
  display.setCursor(50, 28); display.print(secondsLeft);
  display.setTextSize(1);
  display.setCursor(0, 56);  display.print("BTN=cancel  Risk:");
  display.print(riskScore);
  display.display();
}

void showAlertFiredScreen() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(4, 4);   display.print("ALERT SENT");
  display.setTextSize(1);
  display.setCursor(0, 28);  display.print("Risk: "); display.print(riskScore);
  display.setCursor(0, 40);  display.print(alertReason.substring(0, 21));
  display.setCursor(0, 52);  display.print("GSM active (Phase 7)");
  display.display();
}

void showSplashScreen() {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(28, 6);  display.print("ARAS");
  display.setTextSize(1);
  display.setCursor(4, 30);  display.print("Safety Alert System");
  display.setCursor(8, 44);  display.print("Risk Engine v1.0");
  display.display();
}

void showErrorScreen(String component, String msg) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 8);   display.print("[ERROR]");
  display.setCursor(0, 24);  display.print(component);
  display.setCursor(0, 40);  display.print(msg);
  display.display();
}

void beep(int ms) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(ms);
  digitalWrite(BUZZER_PIN, LOW);
}
