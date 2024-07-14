import express from "express";
import { userAuthenticated } from "../utils/user-authenticated";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  likeComment,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/create-comment", userAuthenticated, createComment);
router.get("/get-comments/:postId", getComments);
router.put("/like-comment/:commentId", userAuthenticated, likeComment);
router.put("/edit-comment/:commentId", userAuthenticated, editComment);
router.delete("/delete-comment/:commentId", userAuthenticated, deleteComment);

export default router;
