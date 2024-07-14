import express from "express";
import { userAuthenticated } from "../utils/user-authenticated";
import {
  createComment,
  getComments,
  likeComment,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/create-comment", userAuthenticated, createComment);
router.get("/get-comments/:postId", getComments);
router.put("/like-comment/:commentId", userAuthenticated, likeComment);

export default router;
