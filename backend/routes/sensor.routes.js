import express from "express"

const router = express.Router();

// Temporary in-memory store
let latestSensorData = null;

/**
 * POST sensor data from hardware
 */
router.post("/data", (req, res) => {
  const { userId, heartRate, temperature, motion } = req.body;

  if (!userId || !heartRate || !temperature) {
    return res.status(400).json({
      message: "Invalid sensor data",
    });
  }

  latestSensorData = {
    userId,
    heartRate,
    temperature,
    motion,
    timestamp: new Date(),
  };

  console.log("Sensor Data Received:", latestSensorData);

  res.status(200).json({
    message: "Sensor data received",
    data: latestSensorData,
  });
});

/**
 * GET latest sensor data (for testing)
 */
router.get("/latest", (req, res) => {
  res.json(latestSensorData);
});

export default router;
