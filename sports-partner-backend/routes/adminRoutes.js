import express from "express";
import {
  deleteUser,
  getAllUsers,
  getDashboardStats,
  toggleBlockUser,
  updateUserRole,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getDashboardStats);

router.get("/users", protect, admin, getAllUsers);
router.put("/users/:id/role", protect, admin, updateUserRole);
router.put("/users/:id/block", protect, admin, toggleBlockUser);
router.delete("/users/:id", protect, admin, deleteUser);

export default router;
