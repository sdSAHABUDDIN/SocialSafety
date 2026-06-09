import express from "express";
import { addHealth, getLatestHealth } from "../controllers/healthController.js";

const router = express.Router();

router.post("/", addHealth);
router.get("/:userId", getLatestHealth);

export default router;
