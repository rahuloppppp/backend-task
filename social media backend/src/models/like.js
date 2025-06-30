const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 */

/**
 * Like a post
 * @param {number} userId - ID of the user liking the post
 * @param {number} postId - ID of the post to like
 * @returns {Promise<Object>} - Result of the like operation
 */
const likePost = async (userId, postId) => {
    try {
        // Check if already liked
        const existingLike = await query(
            'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
            [userId, postId]
        );

        if (existingLike.rows.length > 0) {
            return { success: false, message: 'Already liked this post' };
        }

        // Check if post exists and is not deleted
        const post = await query(
            'SELECT id FROM posts WHERE id = $1 AND is_deleted = FALSE',
            [postId]
        );

        if (post.rows.length === 0) {
            return { success: false, message: 'Post not found' };
        }

        const result = await query(
            'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *',
            [userId, postId]
        );

        return { success: true, data: result.rows[0] };
    } catch (error) {
        throw new Error(`Error liking post: ${error.message}`);
    }
};

/**
 * Unlike a post
 * @param {number} userId - ID of the user unliking the post
 * @param {number} postId - ID of the post to unlike
 * @returns {Promise<Object>} - Result of the unlike operation
 */
const unlikePost = async (userId, postId) => {
    try {
        const result = await query(
            'DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING *',
            [userId, postId]
        );

        if (result.rows.length === 0) {
            return { success: false, message: 'Post not liked' };
        }

        return { success: true, data: result.rows[0] };
    } catch (error) {
        throw new Error(`Error unliking post: ${error.message}`);
    }
};

/**
 * Get likes for a specific post
 * @param {number} postId - ID of the post
 * @param {number} limit - Number of results to return
 * @param {number} offset - Number of results to skip
 * @returns {Promise<Array>} - Array of users who liked the post
 */
const getPostLikes = async (postId, limit = 20, offset = 0) => {
    try {
        const result = await query(`
            SELECT u.id, u.username, u.full_name, l.created_at as liked_at
            FROM likes l
            JOIN users u ON l.user_id = u.id
            WHERE l.post_id = $1 AND u.is_deleted = FALSE
            ORDER BY l.created_at DESC
            LIMIT $2 OFFSET $3
        `, [postId, limit, offset]);

        return result.rows;
    } catch (error) {
        throw new Error(`Error getting post likes: ${error.message}`);
    }
};

/**
 * Get posts liked by a specific user
 * @param {number} userId - ID of the user
 * @param {number} limit - Number of results to return
 * @param {number} offset - Number of results to skip
 * @returns {Promise<Array>} - Array of posts liked by the user
 */
const getUserLikes = async (userId, limit = 20, offset = 0) => {
    try {
        const result = await query(`
            SELECT p.id, p.content, p.media_url, p.created_at, l.created_at as liked_at,
                   u.id as user_id, u.username, u.full_name as author_name
            FROM likes l
            JOIN posts p ON l.post_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE l.user_id = $1 AND p.is_deleted = FALSE AND u.is_deleted = FALSE
            ORDER BY l.created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        return result.rows;
    } catch (error) {
        throw new Error(`Error getting user likes: ${error.message}`);
    }
};

/**
 * Get like count for a post
 * @param {number} postId - ID of the post
 * @returns {Promise<number>} - Number of likes
 */
const getPostLikeCount = async (postId) => {
    try {
        const result = await query(
            'SELECT COUNT(*) FROM likes WHERE post_id = $1',
            [postId]
        );

        return parseInt(result.rows[0].count);
    } catch (error) {
        throw new Error(`Error getting post like count: ${error.message}`);
    }
};

/**
 * Check if user has liked a post
 * @param {number} userId - ID of the user
 * @param {number} postId - ID of the post
 * @returns {Promise<boolean>} - True if liked, false otherwise
 */
const hasUserLikedPost = async (userId, postId) => {
    try {
        const result = await query(
            'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
            [userId, postId]
        );

        return result.rows.length > 0;
    } catch (error) {
        throw new Error(`Error checking like status: ${error.message}`);
    }
};

module.exports = {
    likePost,
    unlikePost,
    getPostLikes,
    getUserLikes,
    getPostLikeCount,
    hasUserLikedPost
};
