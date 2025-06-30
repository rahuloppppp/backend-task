const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
    follow,
    unfollow,
    getMyFollowing,
    getMyFollowers,
    getFollowStats,
    searchUsers,
    getUserProfile
} = require("../controllers/users");

const router = express.Router();

/**
 * User-related routes
 */

// POST /api/users/:user_id/follow - Follow a user
router.post("/:user_id/follow", authenticateToken, follow);

// DELETE /api/users/:user_id/unfollow - Unfollow a user
router.delete("/:user_id/unfollow", authenticateToken, unfollow);

// GET /api/users/following - Get users that current user follows
router.get("/following", authenticateToken, getMyFollowing);

// GET /api/users/followers - Get users that follow current user
router.get("/followers", authenticateToken, getMyFollowers);

// GET /api/users/stats - Get follow stats for current user
router.get("/stats", authenticateToken, getFollowStats);

// GET /api/users/search - Find users by name
router.get("/search", authenticateToken, searchUsers);

// GET /api/users/:user_id - Get user profile
router.get("/:user_id", authenticateToken, getUserProfile);

module.exports = router;
