import sys
import joblib
import pandas as pd

model = joblib.load("ml/health_model.pkl")

heartRate = float(sys.argv[1])
temperature = float(sys.argv[2])
motion = float(sys.argv[3])

# Use DataFrame to match training format
X = pd.DataFrame([{
    "heartRate": heartRate,
    "temperature": temperature,
    "motion": motion
}])

prediction = model.predict(X)[0]
print(prediction)
