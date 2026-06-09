import express from "express";
import {
  sendRequest,
  acceptRequest,
  getConnections,
  getPending,
} from "../controllers/connectionController.js";

const router = express.Router();

router.post("/", sendRequest);
router.put("/:id/accept", acceptRequest);
router.get("/:userId/connections", getConnections);
router.get("/:userId/pending", getPending);

export default router;
