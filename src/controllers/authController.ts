import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail,findUserById  } from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, email, hashedPassword);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.log("something",err);
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
