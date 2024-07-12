import express from "express";
import {
  deleteOtherUser,
  deleteUser,
  getUsers,
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
router.get("/get-users/:userId", userAuthenticated, getUsers);
router.delete("/delete-other-user/:userId", userAuthenticated, deleteOtherUser);

export default router;
