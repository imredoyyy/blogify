import express from "express";
import { userAuthenticated } from "../utils/user-authenticated";
import {
    createComment,
    deleteComment,
    editComment,
    getComments,
    getPostComments,
    likeComment,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/create-comment", userAuthenticated, createComment);
router.get("/get-post-comments/:postId", getPostComments);
router.put("/like-comment/:commentId", userAuthenticated, likeComment);
router.put("/edit-comment/:commentId", userAuthenticated, editComment);
router.delete("/delete-comment/:commentId", userAuthenticated, deleteComment);
router.get("/get-comments", userAuthenticated, getComments);

export default router;
