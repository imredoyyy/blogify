import bcrypt from "bcryptjs";
import User from "../models/user";

import { userExists } from "../utils/user-exists";

export const signUp = async (req, res) => {
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
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userExists(email);

    // If user already exists, return error
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
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
    res.status(500).json({ message: error.message });
  }
};
