import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

import { userExists } from "../utils/user-exists";
import { errorHandler } from "../utils/error-handler";
import { generateUsername } from "../utils/generate-username";

export const signUp = async (req, res, next) => {
  // Get user data from request body and trim whitespace
  const name = req.body.name ? req.body.name.trim() : "";
  const email = req.body.email ? req.body.email.trim() : "";
  const password = req.body.password ? req.body.password.trim() : "";

  try {
    // Check if all fields are filled
    if (!name || !email || !password) {
      next(errorHandler(400, "All fields are required"));
    }

    // Check if user already exists
    const existingUser = await userExists(email);

    // If user already exists, return error
    if (existingUser) {
      next(errorHandler(409, "User with this email already exists"));
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
      next(errorHandler(400, "Password must be at least 8 characters long"));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate username
    const username = await generateUsername(email);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Save user
    await newUser.save();

    // Return success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const email = req.body.email ? req.body.email.trim() : "";
  const password = req.body.password ? req.body.password.trim() : "";

  try {
    if (!email || !password) {
      next(errorHandler(400, "All fields are required"));
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      next(errorHandler(404, "User not found"));
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    // Remove password from response
    const { password: userPassword, ...rest } = user._doc;

    // Send response
    res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      })
      .json({ ...rest, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { name, email, image } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token and return user data
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("accessToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        })
        .json(rest);
    } else {
      // Generate username
      const username = await generateUsername(email);

      // If user doesn't exist create new user
      const newUser = new User({
        name,
        email,
        username,
        image,
        authProvider: "google",
      });

      await newUser.save();

      const { password, ...rest } = newUser._doc;

      const token = jwt.sign(
        { id: newUser._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
        }
      );

      res
        .status(200)
        .cookie("accessToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
