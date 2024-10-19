import { Admin } from "../models/adminModel.js"; // Import the Admin model
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Login Controller
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });

    // If admin doesn't exist
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const accessToken = admin.generateAccessToken();

    // Generate refresh token
    const refreshToken = admin.generateRefreshToken();

    // Save refresh token to the admin document in the database
    admin.refreshToken = refreshToken;
    await admin.save();

    // Send tokens as a response
    res.status(200).json({
      accessToken,
      refreshToken,
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
