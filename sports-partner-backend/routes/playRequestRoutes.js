import express from "express";
import {
  createPlayRequest,
  getMyPlayRequests,
  updatePlayRequestStatus,
} from "../controllers/playRequestController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPlayRequest);
router.get("/my", protect, getMyPlayRequests);
router.put("/:id/status", protect, updatePlayRequestStatus);

export default router;
