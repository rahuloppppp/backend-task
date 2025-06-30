// TODO: Implement users controller
// This controller should handle:
// - Following a user
// - Unfollowing a user
// - Getting users that the current user is following
// - Getting users that follow the current user
// - Getting follow counts for a user

const logger = require("../utils/logger");
const { query } = require("../utils/database");
const {
    followUser,
    unfollowUser,
    getFollowing,
    getFollowers,
    getFollowCounts,
    isFollowing
} = require("../models/follow");

/**
 * Follow a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const follow = async (req, res) => {
    try {
        const { user_id } = req.params;
        const followerId = req.user.id;

        if (!user_id || isNaN(parseInt(user_id))) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const result = await followUser(followerId, parseInt(user_id));

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(200).json({
            message: "Successfully followed user",
            data: result.data
        });
    } catch (error) {
        logger.error("Error in follow controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Unfollow a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const unfollow = async (req, res) => {
    try {
        const { user_id } = req.params;
        const followerId = req.user.id;

        if (!user_id || isNaN(parseInt(user_id))) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const result = await unfollowUser(followerId, parseInt(user_id));

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(200).json({
            message: "Successfully unfollowed user",
            data: result.data
        });
    } catch (error) {
        logger.error("Error in unfollow controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get users that the current user is following
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0 } = req.query;

        const following = await getFollowing(userId, parseInt(limit), parseInt(offset));

        res.status(200).json({
            data: following,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        logger.error("Error in getMyFollowing controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get users that follow the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyFollowers = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0 } = req.query;

        const followers = await getFollowers(userId, parseInt(limit), parseInt(offset));

        res.status(200).json({
            data: followers,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        logger.error("Error in getMyFollowers controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get follow stats for current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFollowStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await getFollowCounts(userId);

        res.status(200).json({
            data: stats
        });
    } catch (error) {
        logger.error("Error in getFollowStats controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Search users by name or username
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const searchUsers = async (req, res) => {
    try {
        const { q, limit = 20, offset = 0 } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const searchTerm = `%${q.trim()}%`;
        const result = await query(`
            SELECT id, username, full_name, created_at
            FROM users
            WHERE (username ILIKE $1 OR full_name ILIKE $1) 
            AND is_deleted = FALSE
            ORDER BY 
                CASE 
                    WHEN username ILIKE $1 THEN 1
                    WHEN full_name ILIKE $1 THEN 2
                    ELSE 3
                END,
                created_at DESC
            LIMIT $2 OFFSET $3
        `, [searchTerm, parseInt(limit), parseInt(offset)]);

        res.status(200).json({
            data: result.rows,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        logger.error("Error in searchUsers controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get user profile by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserProfile = async (req, res) => {
    try {
        const { user_id } = req.params;
        const currentUserId = req.user?.id;

        if (!user_id || isNaN(parseInt(user_id))) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const result = await query(`
            SELECT id, username, full_name, created_at
            FROM users
            WHERE id = $1 AND is_deleted = FALSE
        `, [parseInt(user_id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result.rows[0];
        const stats = await getFollowCounts(user.id);

        // Check if current user is following this user
        let isFollowingUser = false;
        if (currentUserId) {
            isFollowingUser = await isFollowing(currentUserId, user.id);
        }

        res.status(200).json({
            data: {
                ...user,
                stats,
                is_following: isFollowingUser
            }
        });
    } catch (error) {
        logger.error("Error in getUserProfile controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    follow,
    unfollow,
    getMyFollowing,
    getMyFollowers,
    getFollowStats,
    searchUsers,
    getUserProfile
};
