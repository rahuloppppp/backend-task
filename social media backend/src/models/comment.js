const { query } = require("../utils/database");

/**
 * Comment model for managing post comments
 */

/**
 * Create a comment on a post
 * @param {number} userId - ID of the user creating the comment
 * @param {number} postId - ID of the post to comment on
 * @param {string} content - Comment content
 * @returns {Promise<Object>} - Result of the comment creation
 */
const createComment = async (userId, postId, content) => {
    try {
        // Check if post exists and comments are enabled
        const post = await query(
            'SELECT id, comments_enabled FROM posts WHERE id = $1 AND is_deleted = FALSE',
            [postId]
        );

        if (post.rows.length === 0) {
            return { success: false, message: 'Post not found' };
        }

        if (!post.rows[0].comments_enabled) {
            return { success: false, message: 'Comments are disabled for this post' };
        }

        const result = await query(
            'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, postId, content]
        );

        return { success: true, data: result.rows[0] };
    } catch (error) {
        throw new Error(`Error creating comment: ${error.message}`);
    }
};

/**
 * Update a comment
 * @param {number} commentId - ID of the comment to update
 * @param {number} userId - ID of the user updating the comment
 * @param {string} content - New comment content
 * @returns {Promise<Object>} - Result of the comment update
 */
const updateComment = async (commentId, userId, content) => {
    try {
        // Check if comment exists and belongs to user
        const existingComment = await query(
            'SELECT * FROM comments WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE',
            [commentId, userId]
        );

        if (existingComment.rows.length === 0) {
            return { success: false, message: 'Comment not found or not authorized' };
        }

        const result = await query(
            'UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [content, commentId, userId]
        );

        return { success: true, data: result.rows[0] };
    } catch (error) {
        throw new Error(`Error updating comment: ${error.message}`);
    }
};

/**
 * Delete a comment (soft delete)
 * @param {number} commentId - ID of the comment to delete
 * @param {number} userId - ID of the user deleting the comment
 * @returns {Promise<Object>} - Result of the comment deletion
 */
const deleteComment = async (commentId, userId) => {
    try {
        // Check if comment exists and belongs to user
        const existingComment = await query(
            'SELECT * FROM comments WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE',
            [commentId, userId]
        );

        if (existingComment.rows.length === 0) {
            return { success: false, message: 'Comment not found or not authorized' };
        }

        const result = await query(
            'UPDATE comments SET is_deleted = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
            [commentId, userId]
        );

        return { success: true, data: result.rows[0] };
    } catch (error) {
        throw new Error(`Error deleting comment: ${error.message}`);
    }
};

/**
 * Get comments for a specific post
 * @param {number} postId - ID of the post
 * @param {number} limit - Number of results to return
 * @param {number} offset - Number of results to skip
 * @returns {Promise<Array>} - Array of comments
 */
const getPostComments = async (postId, limit = 20, offset = 0) => {
    try {
        const result = await query(`
            SELECT c.id, c.content, c.created_at, c.updated_at,
                   u.id as user_id, u.username, u.full_name as author_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1 AND c.is_deleted = FALSE AND u.is_deleted = FALSE
            ORDER BY c.created_at DESC
            LIMIT $2 OFFSET $3
        `, [postId, limit, offset]);

        return result.rows;
    } catch (error) {
        throw new Error(`Error getting post comments: ${error.message}`);
    }
};

/**
 * Get comment count for a post
 * @param {number} postId - ID of the post
 * @returns {Promise<number>} - Number of comments
 */
const getPostCommentCount = async (postId) => {
    try {
        const result = await query(
            'SELECT COUNT(*) FROM comments WHERE post_id = $1 AND is_deleted = FALSE',
            [postId]
        );

        return parseInt(result.rows[0].count);
    } catch (error) {
        throw new Error(`Error getting post comment count: ${error.message}`);
    }
};

/**
 * Get a specific comment by ID
 * @param {number} commentId - ID of the comment
 * @returns {Promise<Object>} - Comment object
 */
const getCommentById = async (commentId) => {
    try {
        const result = await query(`
            SELECT c.id, c.content, c.created_at, c.updated_at,
                   u.id as user_id, u.username, u.full_name as author_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = $1 AND c.is_deleted = FALSE AND u.is_deleted = FALSE
        `, [commentId]);

        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Error getting comment: ${error.message}`);
    }
};

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getPostComments,
    getPostCommentCount,
    getCommentById
};
