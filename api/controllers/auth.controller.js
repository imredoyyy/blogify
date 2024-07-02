import bcrypt from "bcryptjs";
import User from "../models/user";

import { userExists } from "../utils/user-exists";
import { errorHandler } from "../utils/error-handler";

export const signUp = async (req, res, next) => {
  // Get user data from request body
  const { name, email, password } = req.body;

  try {
    // Check if all fields are filled
    if (
      !name ||
      !email ||
      !password ||
      name === "" ||
      email === "" ||
      password === ""
    ) {
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

    // Create new user
    const newUser = await User.create({
      name,
      email,
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
