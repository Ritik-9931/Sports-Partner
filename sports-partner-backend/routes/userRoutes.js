import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  getNearbyPartners,
  getStatsHome,
  getUserProfileById,
  updateLocation,
  updatePrivacy,
  updateProfile,
} from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", protect, getMyProfile);

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

router.put("/location", protect, updateLocation);

router.put("/privacy", protect, updatePrivacy);

router.get("/partners", protect, getNearbyPartners);

router.get("/profile/:id", protect, getUserProfileById);

router.get("/homeStates", protect, getStatsHome);

export default router;