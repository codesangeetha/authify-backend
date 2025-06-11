import express from "express";
import { adminLogin, getAllUsers, getUserById, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin } from "../controllers/adminController";
import { verifyAdminToken } from "../middleware/adminAuth";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", verifyAdminToken, getAllUsers);
router.get("/users/:id", verifyAdminToken, getUserById);
router.post("/users", verifyAdminToken, createUserByAdmin);
router.put("/users/:id", verifyAdminToken, updateUserByAdmin);
router.delete("/users/:id", verifyAdminToken, deleteUserByAdmin);


export default router;
