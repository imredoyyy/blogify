import express from "express";
import { googleAuth, signIn, signUp } from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/google", googleAuth);

export default router;
