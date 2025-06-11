import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import path from "path";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/admin", adminRoutes);

export default app;
