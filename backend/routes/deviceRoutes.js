import express from "express";
import { receiveHealthData } from "../controllers/deviceController.js";

const router = express.Router();

// Hardware sends data here
router.post("/health", receiveHealthData);

export default router;
