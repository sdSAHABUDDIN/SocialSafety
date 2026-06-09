import Health from "../models/healthModel.js";
import { predictHealth } from "../utils/mlService.js";

export const receiveHealthData = async (req, res) => {
  try {
    const {
      userId,
      heartRate,
      temperature,
      motion
    } = req.body;

    // 1️⃣ Save raw sensor data
    const health = await Health.create({
      user: userId,
      heartRate,
      temperature,
      motion
    });

    // 2️⃣ Call ML model
    const prediction = await predictHealth({
      heartRate,
      temperature,
      motion
    });

    // 3️⃣ Decide status
    const status = prediction === 1 ? "ABNORMAL" : "NORMAL";

    // 4️⃣ Update record
    health.status = status;
    await health.save();

    // 5️⃣ Respond
    res.status(200).json({
      message: "Health data processed",
      status
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Device data processing failed" });
  }
};
