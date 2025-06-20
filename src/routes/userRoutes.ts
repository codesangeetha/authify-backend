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
