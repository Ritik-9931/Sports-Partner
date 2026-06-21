import express from "express";
import {
  approveCommunityJoinRequest,
  blockUserFromCommunity,
  createCommunity,
  deleteCommunity,
  getCommunities,
  getCommunityById,
  getCommunityJoinRequests,
  joinCommunity,
  leaveCommunity,
  rejectCommunityJoinRequest,
  toggleCommunityActive,
  toggleCommunityBlock,
  unblockUserFromCommunity,
  updateCommunity,
} from "../controllers/communityController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createCommunity);
router.get("/", protect, getCommunities);
router.get("/:id", protect, getCommunityById);

router.put("/:id", protect, upload.single("image"), updateCommunity);
router.put("/:id/join", protect, joinCommunity);
router.put("/:id/leave", protect, leaveCommunity);
router.put("/:id/active", protect, toggleCommunityActive);

router.get("/:id/join-requests", protect, getCommunityJoinRequests);
router.put(
  "/join-requests/:requestId/approve",
  protect,
  approveCommunityJoinRequest,
);
router.put(
  "/join-requests/:requestId/reject",
  protect,
  rejectCommunityJoinRequest,
);

router.put("/:id/block-user", protect, blockUserFromCommunity);
router.put("/:id/unblock-user", protect, unblockUserFromCommunity);

router.put("/:id/block", protect, admin, toggleCommunityBlock);
router.delete("/:id", protect, admin, deleteCommunity);

export default router;
