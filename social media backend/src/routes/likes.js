const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
    likePost,
    unlikePost,
    getPostLikes,
    getUserLikes,
    getPostLikeCount,
    checkUserLikeStatus
} = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 */

// POST /api/likes/:post_id - Like a post
router.post("/:post_id", authenticateToken, likePost);

// DELETE /api/likes/:post_id - Unlike a post
router.delete("/:post_id", authenticateToken, unlikePost);

// GET /api/likes/:post_id - Get likes for a post
router.get("/:post_id", authenticateToken, getPostLikes);

// GET /api/likes/user/me - Get posts liked by current user
router.get("/user/me", authenticateToken, getUserLikes);

// GET /api/likes/:post_id/count - Get like count for a post
router.get("/:post_id/count", authenticateToken, getPostLikeCount);

// GET /api/likes/:post_id/status - Check if current user has liked a post
router.get("/:post_id/status", authenticateToken, checkUserLikeStatus);

module.exports = router;
