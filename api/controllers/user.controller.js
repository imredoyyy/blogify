import bcrypt from "bcryptjs";
import User from "../models/user";
import { errorHandler } from "../utils/error-handler";

export const test = (req, res) => {
  res.json({ message: "Testing" });
};

export const updateUserInfo = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only update your own profile"));
  }

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const updatedFields = {};

    if (
      req.body.currentPassword &&
      req.body.newPassword &&
      req.body.confirmPassword
    ) {
      if (
        req.body.newPassword.length < 8 ||
        req.body.confirmPassword.length < 8
      ) {
        return next(
          errorHandler(400, "New password must be at least 8 characters long")
        );
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          errorHandler(400, "New password & confirm password do not match!")
        );
      }

      const isMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isMatch) {
        return next(errorHandler(400, "Incorrect password"));
      }

      updatedFields.password = await bcrypt.hash(req.body.confirmPassword, 10);
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (req.body.username) {
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username must be lowercase!"));
      }

      if (req.body.username.length < 5 || req.body.username.length > 20) {
        return next(
          errorHandler(
            400,
            "Username must be between 5 and 20 characters long!"
          )
        );
      }

      if (!usernameRegex.test(req.body.username)) {
        return next(
          errorHandler(
            400,
            "Username must not contain special characters or spaces!"
          )
        );
      }

      updatedFields.username = req.body.username;
    }

    if (req.body.name) updatedFields.name = req.body.name;
    if (req.body.email) updatedFields.email = req.body.email;
    if (req.body.image) updatedFields.image = req.body.image;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updatedFields },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only delete your own profile"));
  }

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
