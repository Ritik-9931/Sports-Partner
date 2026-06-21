import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import {
  createGame,
  deleteGame,
  getGameById,
  getGames,
  updateGame,
} from "../controllers/gameController.js";

const router = express.Router();

router.post("/", protect, admin, createGame);

router.get("/", protect, getGames);

router
  .route("/:id")
  .get(protect, getGameById)
  .put(protect, admin, updateGame)
  .delete(protect, admin, deleteGame);

export default router;
