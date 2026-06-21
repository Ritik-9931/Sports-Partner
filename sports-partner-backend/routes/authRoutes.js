import express from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import upload from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser);

router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

export default router;
