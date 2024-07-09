import express from "express";
import { userAuthenticated } from "../utils/user-authenticated";
import { createPost, getPosts } from "../controllers/post.controller";

const router = express.Router();

router.post("/create-post", userAuthenticated, createPost);
router.get("/get-posts", getPosts);

export default router;
