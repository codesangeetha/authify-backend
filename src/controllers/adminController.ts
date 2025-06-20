import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "../models/adminModel";
import { createUser, findUserByEmail, updateUserProfileById, deleteUserModel } from "../models/userModel";
import dotenv from "dotenv";
import { pool } from "../config/db";

dotenv.config();

export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const admin = await findAdminByEmail(email);
        if (!admin) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};


export const getAllUsers = async (req: Request, res: Response) => {
    const search = req.query.search?.toString().toLowerCase() || "";
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        const values: any[] = [];
        const conditions: string[] = [];

        if (search) {
            conditions.push(`(LOWER(username) LIKE $${values.length + 1} OR LOWER(email) LIKE $${values.length + 1})`);
            values.push(`%${search}%`);
        }

        if (startDate) {
            conditions.push(`created_at >= $${values.length + 1}`);
            values.push(startDate);
        }

        if (endDate) {
            conditions.push(`created_at <= $${values.length + 1}`);
            values.push(endDate);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
        const countResult = await pool.query(countQuery, values);
        const totalUsers = parseInt(countResult.rows[0].count);

        values.push(limit, offset);
        const usersQuery = `
            SELECT id, username, email, created_at
            FROM users
            ${whereClause}
            ORDER BY id DESC
            LIMIT $${values.length - 1} OFFSET $${values.length}
        `;
        const usersResult = await pool.query(usersQuery, values);

        res.json({
            users: usersResult.rows,
            pagination: {
                page,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};



export const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            "SELECT id, username, email FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};



export const createUserByAdmin = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, email, hashedPassword);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};



export const updateUserByAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
    }

    try {
        await updateUserProfileById(id, username, email);
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};


export const deleteUserByAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await deleteUserModel(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
};