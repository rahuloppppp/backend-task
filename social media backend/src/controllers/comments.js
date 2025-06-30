// TODO: Implement comments controller
// This controller should handle:
// - Creating comments on posts
// - Editing user's own comments
// - Deleting user's own comments
// - Getting comments for a post
// - Pagination for comments

const logger = require("../utils/logger");
const {
    createComment,
    updateComment,
    deleteComment,
    getPostComments,
    getPostCommentCount,
    getCommentById
} = require("../models/comment");

/**
 * Create a comment on a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCommentController = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const result = await createComment(userId, parseInt(post_id), content.trim());

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(201).json({
            message: "Comment created successfully",
            data: result.data
        });
    } catch (error) {
        logger.error("Error in createComment controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update a comment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCommentController = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!comment_id || isNaN(parseInt(comment_id))) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const result = await updateComment(parseInt(comment_id), userId, content.trim());

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(200).json({
            message: "Comment updated successfully",
            data: result.data
        });
    } catch (error) {
        logger.error("Error in updateComment controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Delete a comment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCommentController = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const userId = req.user.id;

        if (!comment_id || isNaN(parseInt(comment_id))) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const result = await deleteComment(parseInt(comment_id), userId);

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(200).json({
            message: "Comment deleted successfully",
            data: result.data
        });
    } catch (error) {
        logger.error("Error in deleteComment controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get comments for a specific post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPostCommentsController = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { limit = 20, offset = 0 } = req.query;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const comments = await getPostComments(parseInt(post_id), parseInt(limit), parseInt(offset));

        res.status(200).json({
            data: comments,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        logger.error("Error in getPostComments controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get comment count for a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPostCommentCountController = async (req, res) => {
    try {
        const { post_id } = req.params;

        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const count = await getPostCommentCount(parseInt(post_id));

        res.status(200).json({
            data: { count }
        });
    } catch (error) {
        logger.error("Error in getPostCommentCount controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get a specific comment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCommentByIdController = async (req, res) => {
    try {
        const { comment_id } = req.params;

        if (!comment_id || isNaN(parseInt(comment_id))) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const comment = await getCommentById(parseInt(comment_id));

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({
            data: comment
        });
    } catch (error) {
        logger.error("Error in getCommentById controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createComment: createCommentController,
    updateComment: updateCommentController,
    deleteComment: deleteCommentController,
    getPostComments: getPostCommentsController,
    getPostCommentCount: getPostCommentCountController,
    getCommentById: getCommentByIdController
};
