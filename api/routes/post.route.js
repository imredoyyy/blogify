import express from "express";
import { userAuthenticated } from "../utils/user-authenticated";
import { createPost } from "../controllers/post.controller";

const router = express.Router();

router.post("/create-post", userAuthenticated, createPost);

export default router;
