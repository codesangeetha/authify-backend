/**
 * @swagger
 * /api/user/testmail:
 *   get:
 *     summary: Test mail sending
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Test mail sent
 *
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 *
 * /api/user/profile/upload:
 *   post:
 *     summary: Upload user profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded
 *       401:
 *         description: Unauthorized
 */

import express from "express";
import { getUserProfile, testMail, updateUserProfile, uploadProfileImage } from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.get("/testmail", testMail);
router.put("/profile", verifyToken, updateUserProfile);
router.post(
    "/profile/upload",
    verifyToken,
    upload.single("profileImage"),
    uploadProfileImage
);

export default router;
