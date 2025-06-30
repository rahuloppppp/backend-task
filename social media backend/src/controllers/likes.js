// TODO: Implement likes controller
// This controller should handle:
// - Liking posts
// - Unliking posts
// - Getting likes for a post
// - Getting posts liked by a user

const logger = require("../utils/logger");
const {
    likePost,
    unlikePost,
    getPostLikes,
    getUserLikes,
    getPostLikeCount,
    hasUserLikedPost
} = require("../models/like");

/**
 * Like a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const likePostController = async (req, res) => {
    try {
        const { post_id } = req.params;
        const userId = req.user.id;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const result = await likePost(userId, parseInt(post_id));

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(200).json({
            message: "Post liked successfully",
            data: result.data
        });
    } catch (error) {
        logger.error("Error in likePost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Unlike a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const unlikePostController = async (req, res) => {
    try {
        const { post_id } = req.params;
        const userId = req.user.id;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const result = await unlikePost(userId, parseInt(post_id));

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(200).json({
            message: "Post unliked successfully",
            data: result.data
        });
    } catch (error) {
        logger.error("Error in unlikePost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get likes for a specific post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPostLikesController = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { limit = 20, offset = 0 } = req.query;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const likes = await getPostLikes(parseInt(post_id), parseInt(limit), parseInt(offset));

        res.status(200).json({
            data: likes,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        logger.error("Error in getPostLikes controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get posts liked by the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserLikesController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0 } = req.query;

        const likedPosts = await getUserLikes(userId, parseInt(limit), parseInt(offset));

        res.status(200).json({
            data: likedPosts,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        logger.error("Error in getUserLikes controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get like count for a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPostLikeCountController = async (req, res) => {
    try {
        const { post_id } = req.params;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const count = await getPostLikeCount(parseInt(post_id));

        res.status(200).json({
            data: { count }
        });
    } catch (error) {
        logger.error("Error in getPostLikeCount controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Check if current user has liked a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkUserLikeStatus = async (req, res) => {
    try {
        const { post_id } = req.params;
        const userId = req.user.id;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const hasLiked = await hasUserLikedPost(userId, parseInt(post_id));

        res.status(200).json({
            data: { has_liked: hasLiked }
        });
    } catch (error) {
        logger.error("Error in checkUserLikeStatus controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    likePost: likePostController,
    unlikePost: unlikePostController,
    getPostLikes: getPostLikesController,
    getUserLikes: getUserLikesController,
    getPostLikeCount: getPostLikeCountController,
    checkUserLikeStatus
};
