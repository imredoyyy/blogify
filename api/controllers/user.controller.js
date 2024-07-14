import bcrypt from "bcryptjs";
import User from "../models/user";
import { errorHandler } from "../utils/error-handler";
import { usernameExists } from "../utils/user-exists";

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

      try {
        const exists = await usernameExists(req.body.username);
        if (exists) {
          return next(
            errorHandler(400, "Username already exists! Use a different one!")
          );
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

        updatedFields.username = req.body.username.trim();
      } catch (error) {
        return next(errorHandler(500, "Error checking username availability"));
      }
    }

    if (req.body.name) updatedFields.name = req.body.name.trim();
    if (req.body.email) updatedFields.email = req.body.email.trim();
    if (req.body.image) updatedFields.image = req.body.image.trim();

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

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  const { userId } = req.params;

  if (req.user.id !== userId) {
    return next(
      errorHandler(403, "You don't have privilege to see all users.")
    );
  }

  try {
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));

    const isAdmin = (await user.role) === "admin";

    if (!isAdmin) {
      return next(
        errorHandler(403, "You don't have privilege to see all users.")
      );
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "ascending" ? 1 : -1;

    const query = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const allUsers = query.map((user) => {
      const { password, ...rest } = user._doc;

      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    // If the last month is January, set the year to the previous year
    if (now.getMonth() === 0) {
      lastMonth.setFullYear(now.getFullYear() - 1);
      lastMonth.setMonth(11); // December
    }

    const lastMonthUsers = await User.find({
      createdAt: { $gte: lastMonth },
    });

    res.status(200).json({
      users: allUsers,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOtherUser = async (req, res, next) => {
  const { userId } = req.params;
  const { id } = req.user;

  try {
    const isAdmin = (await User.findById(id)).role === "admin";

    if (!isAdmin) {
      return next(errorHandler(403, "Only admin can perform this action."));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return next(errorHandler(404, "User not found"));

    const { email, password, role, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
