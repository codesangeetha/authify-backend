import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById, updateUserPasswordById } from "../models/userModel";
import { sendEmail } from "../helpers/functions";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, email, hashedPassword);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.log("something", err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // 4. Return token and user (excluding password)
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { id, username, email } = user;
    res.json({ id, username, email });
  } catch (err) {
    console.log('getMe err : ', err);
    res.status(500).json({ error: "Server error" });
  }
};



export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      // Respond the same even if email doesn't exist
      return res.status(500).json({ message: "No user found" });
    }

    // Create a reset token (valid for 15 minutes)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

    const resetLink = `http://localhost:5173/reset/${token}`; // Replace with frontend URL


    await sendEmail(user.email, "Password Reset", `Click the link to reset your password: ${resetLink}`);


    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error", details: err });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update user password in DB
    await updateUserPasswordById(decoded.id, hashedPassword);

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
