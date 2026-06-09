import Health from "../models/healthModel.js";

import { predictHealth } from "../utils/mlService.js";

export const addHealth = async (req, res) => {
  try {
    const { userId, heartRate, temperature, motion, lat, lng } = req.body;

    const mlResult = await predictHealth({
      heart_rate: heartRate,
      temperature,
      motion: motion ? 1 : 0,
    });

    const status =
      mlResult === 1 ? "Emergency" : "Normal";

    const health = await Health.create({
      userId,
      heartRate,
      temperature,
      motion,
      status,
      lat,
      lng,
      lastSync: "Just now",
    });

    res.json({
      message: "Health data saved",
      status,
    });
  } catch (err) {
    res.status(500).json({ error: "Health save failed" });
  }
};

export const getLatestHealth = async (req, res) => {
  try {
    const { userId } = req.params;

    const latestHealth = await Health.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latestHealth) {
      return res.json({ status: "NO_DATA" });
    }

    res.json({
      status: latestHealth.status,
      heartRate: latestHealth.heartRate,
      temperature: latestHealth.temperature,
      motion: latestHealth.motion ? "Active" : "Inactive",
      updatedAt: latestHealth.createdAt,
      lat: latestHealth.lat,
      lng: latestHealth.lng,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch health data" });
  }
};
