import express from "express";
import { createPost, getFeed } from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/:userId/feed", getFeed);

export default router;
