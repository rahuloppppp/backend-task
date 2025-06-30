const { query } = require("../utils/database");

/**
 * Follow model for managing user relationships
 */

/**
 * Follow a user
 * @param {number} followerId - ID of the user who wants to follow
 * @param {number} followingId - ID of the user to be followed
 * @returns {Promise<Object>} - Result of the follow operation
 */
const followUser = async (followerId, followingId) => {
    try {
        // Check if already following
        const existingFollow = await query(
            'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
            [followerId, followingId]
        );

        if (existingFollow.rows.length > 0) {
            return { success: false, message: 'Already following this user' };
        }

        // Check if trying to follow self
        if (followerId === followingId) {
            return { success: false, message: 'Cannot follow yourself' };
        }

        // Check if target user exists
        const targetUser = await query('SELECT id FROM users WHERE id = $1 AND is_deleted = FALSE', [followingId]);
        if (targetUser.rows.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const result = await query(
            'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING *',
            [followerId, followingId]
        );

        return { success: true, data: result.rows[0] };
    } catch (error) {
        throw new Error(`Error following user: ${error.message}`);
    }
};

/**
 * Unfollow a user
 * @param {number} followerId - ID of the user who wants to unfollow
 * @param {number} followingId - ID of the user to be unfollowed
 * @returns {Promise<Object>} - Result of the unfollow operation
 */
const unfollowUser = async (followerId, followingId) => {
    try {
        const result = await query(
            'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *',
            [followerId, followingId]
        );

        if (result.rows.length === 0) {
            return { success: false, message: 'Not following this user' };
        }

        return { success: true, data: result.rows[0] };
    } catch (error) {
        throw new Error(`Error unfollowing user: ${error.message}`);
    }
};

/**
 * Get users that the current user is following
 * @param {number} userId - ID of the current user
 * @param {number} limit - Number of results to return
 * @param {number} offset - Number of results to skip
 * @returns {Promise<Array>} - Array of users being followed
 */
const getFollowing = async (userId, limit = 20, offset = 0) => {
    try {
        const result = await query(`
            SELECT u.id, u.username, u.full_name, u.created_at, f.created_at as followed_at
            FROM follows f
            JOIN users u ON f.following_id = u.id
            WHERE f.follower_id = $1 AND u.is_deleted = FALSE
            ORDER BY f.created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        return result.rows;
    } catch (error) {
        throw new Error(`Error getting following: ${error.message}`);
    }
};

/**
 * Get users that follow the current user
 * @param {number} userId - ID of the current user
 * @param {number} limit - Number of results to return
 * @param {number} offset - Number of results to skip
 * @returns {Promise<Array>} - Array of followers
 */
const getFollowers = async (userId, limit = 20, offset = 0) => {
    try {
        const result = await query(`
            SELECT u.id, u.username, u.full_name, u.created_at, f.created_at as followed_at
            FROM follows f
            JOIN users u ON f.follower_id = u.id
            WHERE f.following_id = $1 AND u.is_deleted = FALSE
            ORDER BY f.created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        return result.rows;
    } catch (error) {
        throw new Error(`Error getting followers: ${error.message}`);
    }
};

/**
 * Get follow counts for a user
 * @param {number} userId - ID of the user
 * @returns {Promise<Object>} - Object with following and followers count
 */
const getFollowCounts = async (userId) => {
    try {
        const followingCount = await query(
            'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
            [userId]
        );

        const followersCount = await query(
            'SELECT COUNT(*) FROM follows WHERE following_id = $1',
            [userId]
        );

        return {
            following: parseInt(followingCount.rows[0].count),
            followers: parseInt(followersCount.rows[0].count)
        };
    } catch (error) {
        throw new Error(`Error getting follow counts: ${error.message}`);
    }
};

/**
 * Check if user is following another user
 * @param {number} followerId - ID of the potential follower
 * @param {number} followingId - ID of the potential following
 * @returns {Promise<boolean>} - True if following, false otherwise
 */
const isFollowing = async (followerId, followingId) => {
    try {
        const result = await query(
            'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
            [followerId, followingId]
        );

        return result.rows.length > 0;
    } catch (error) {
        throw new Error(`Error checking follow status: ${error.message}`);
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowing,
    getFollowers,
    getFollowCounts,
    isFollowing
};
