import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
    createPost,
    getPosts,
    deletePost,
    addComment,
    getComments,
    deleteComment,
    likePost
} from "../controllers/communityPostController.js";

const router = express.Router();

// Posts
router.post("/:communityId/posts", protect, upload.single("image"), createPost);

router.get("/:communityId/posts", protect, getPosts);

router.delete("/posts/:postId", protect, deletePost);

// Comments
router.post("/posts/:postId/comments", protect, addComment);

router.get("/posts/:postId/comments", protect, getComments);

router.delete("/comments/:commentId", protect, deleteComment);

// Like
router.put("/posts/:postId/like", protect, likePost);

export default router;