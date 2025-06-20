import { Request, Response } from "express";
import { findUserProfileById, updateUserProfileById, updateUserProfileImage } from "../models/userModel";
import path from "path";
import { sendEmail } from "../helpers/functions";

export const getUserProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = await findUserProfileById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { username, email, profile_image } = user;
        res.json({
            username,
            email,
            profileImage: `/uploads/${profile_image}`
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
    }

    try {
        await updateUserProfileById(req.user.id, username, email);
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};


export const uploadProfileImage = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filename = req.file.filename;

    try {
        await updateUserProfileImage(req.user.id, filename);
        res.json({
            message: "Profile image uploaded successfully",
            profileImageUrl: `/uploads/${filename}`
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};


export const testMail = async (req: Request, res: Response) => {
   
await sendEmail("sangeetharenganath98@gmail.com", "hi sangeetha", "to check mail.");

   
        res.json({
           message :"Hello from node"
        });
   
};

