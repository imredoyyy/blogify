import express from "express";
import { userAuthenticated } from "../utils/user-authenticated";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller";

const router = express.Router();

router.post("/create-post", userAuthenticated, createPost);
router.get("/get-posts", getPosts);
router.delete("/delete-post/:userId/:postId", userAuthenticated, deletePost);

export default router;
