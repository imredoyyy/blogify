import express from "express";
import { userAuthenticated } from "../utils/user-authenticated";
import { createComment } from "../controllers/comment.controller";

const router = express.Router();

router.post("/create-comment", userAuthenticated, createComment);

export default router;
