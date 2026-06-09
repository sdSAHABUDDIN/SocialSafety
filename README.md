# Personal Health Monitoring and AI-Driven Emergency Alert System with Intelligent Web Dashboard

## 📌 Overview

The Personal Health Monitoring and AI-Driven Emergency Alert System is an IoT-based healthcare solution designed to continuously monitor vital health parameters, detect emergencies, and automatically notify caregivers or emergency contacts in real time.

The system combines wearable sensors, embedded systems, cloud computing, artificial intelligence, and a modern web dashboard to provide proactive healthcare monitoring and rapid emergency response.

The device continuously collects health and movement data, calculates a risk score, predicts potential emergencies, and instantly sends alerts with GPS location information when a critical situation is detected.

---

## 🎯 Problem Statement

Many medical emergencies such as heart attacks, falls, unconsciousness, and health deterioration occur when immediate medical assistance is unavailable.

Traditional monitoring systems often:

* Require manual intervention
* Lack real-time prediction
* Do not provide location-aware emergency alerts
* Cannot continuously monitor users outside hospitals

This project addresses these limitations by providing an intelligent and automated emergency response system.

---

## 🚀 Key Features

### Real-Time Health Monitoring

* Heart Rate Monitoring
* Blood Oxygen (SpO₂) Monitoring
* Blood Pressure Monitoring
* Body Temperature Monitoring

### Safety Monitoring

* Fall Detection
* Motion Tracking
* GPS Location Tracking
* Panic Button Emergency Trigger

### AI-Powered Prediction

* Health Risk Prediction
* Emergency Detection
* Risk Score Generation (0–100)

### Emergency Response

* Instant SMS Alerts
* Emergency Phone Calls
* GPS Location Sharing
* Emergency Image Capture
* Local Buzzer Alert

### Intelligent Dashboard

* Live Health Monitoring
* Device Status Tracking
* Risk History Visualization
* Emergency Event Logs
* Location Tracking

---

## 🏗️ System Architecture

### Hardware Components

| Component             | Purpose                   |
| --------------------- | ------------------------- |
| ESP32                 | Main Processing Unit      |
| MPU6050               | Motion & Fall Detection   |
| NEO-6M GPS            | Location Tracking         |
| Heart Rate Sensor     | Heart Monitoring          |
| SpO₂ Sensor           | Oxygen Monitoring         |
| Blood Pressure Sensor | Blood Pressure Monitoring |
| OLED Display          | Local Status Display      |
| Buzzer                | Local Alert System        |
| SIM800L GSM           | SMS & Calling Service     |

---

## ⚙️ Technology Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Cloud Services

* Firebase
* AWS Cloud Services

### Embedded Systems

* ESP32

### Communication

* MQTT
* WiFi
* GSM

### Artificial Intelligence

* LSTM (Long Short-Term Memory)
* Random Forest Classifier

---

## 🔄 System Workflow

1. Sensors collect health and motion data.
2. ESP32 performs edge processing and data filtering.
3. AI models analyze incoming data.
4. Risk score is calculated.
5. Decision engine classifies risk level.
6. Emergency actions are triggered if required.
7. SMS and location alerts are sent.
8. Data is synchronized with cloud services.
9. Dashboard displays real-time information.
10. Emergency contacts receive notifications.

---

## 📊 Performance Results

| Metric                         | Result      |
| ------------------------------ | ----------- |
| Prediction Accuracy            | 96.2%       |
| Fall Detection Accuracy        | 97.1%       |
| Alert Response Time            | 4.2 Seconds |
| Emergency Response Improvement | 38%         |

---

## 📷 Project Screenshots

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Emergency Alert Page

![Emergency Alert](docs/screenshots/connection.png)

### Device Monitoring Page

![Health Monitoring](docs/screenshots/deviceMonitoring.png)

### Hardware Prototype

![Hardware Setup](docs/screenshots/Hardware_image.png)

---

## 📂 Repository Structure

```bash
Personal-Health-Monitoring-System
│
├── frontend/
├── backend/
├── hardware/
├── docs/
│   ├── architecture-diagram.png
│   ├── workflow-diagram.png
│   ├── screenshots/
│
├── research/
│   ├── publication.pdf
│
└── README.md
```

---


## 🎓 Research Publication

Published In:

Computer Science Journal

ISSN: 1002-137X

Volume 16, Issue 5 (2026)

Pages: 12–19

---

## 👨‍💻 My Contribution

Student Author

Department of Electronics and Communication Engineering

JIS College of Engineering

### Responsibilities

* Frontend Development using React.js
* Backend API Development using Node.js
* Database Integration with MongoDB
* Dashboard Design and Implementation
* IoT System Integration
* Cloud Communication Workflow
* Emergency Alert System Design
* System Architecture Planning

---

## 🔮 Future Enhancements

* Mobile Application Support
* Doctor Portal Integration
* Wearable Smartwatch Integration
* Advanced AI Health Prediction
* Voice-Based Emergency Assistance
* Hospital Management System Integration

---

## ⭐ Conclusion

This project demonstrates the integration of IoT, Artificial Intelligence, Embedded Systems, Cloud Computing, and Web Technologies to create an intelligent healthcare monitoring platform capable of predicting emergencies and providing rapid response mechanisms.

The system aims to improve patient safety, reduce emergency response time, and enable continuous remote healthcare monitoring.
