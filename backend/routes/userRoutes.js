import express from "express";
import { createUser, getUserProfile, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getUserProfile);
router.put("/:id",updateUser);
export default router;
