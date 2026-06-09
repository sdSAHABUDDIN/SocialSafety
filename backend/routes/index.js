import express from "express";

import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import connectionRoutes from "./connectionRoutes.js";
import healthRoutes from "./healthRoutes.js";
import deviceRoutes from "./deviceRoutes.js"; // (we'll create this next)

const router = express.Router();

// Base route check
router.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// App routes
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/connections", connectionRoutes);
router.use("/health", healthRoutes);
router.use("/device", deviceRoutes); // hardware → backend

export default router;
