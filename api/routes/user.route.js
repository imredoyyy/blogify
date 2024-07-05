import express from "express";
import { test, updateUserInfo } from "../controllers/user.controller";
import { userAuthenticated } from "../utils/user-authenticated";

const router = express.Router();

router.get("/", test);
router.put("/update/:userId", userAuthenticated, updateUserInfo);

export default router;
