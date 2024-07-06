import express from "express";
import {
  deleteUser,
  signOut,
  test,
  updateUserInfo,
} from "../controllers/user.controller";
import { userAuthenticated } from "../utils/user-authenticated";

const router = express.Router();

router.get("/", test);
router.put("/update/:userId", userAuthenticated, updateUserInfo);
router.delete("/delete/:userId", userAuthenticated, deleteUser);
router.post("/signout", signOut);

export default router;
