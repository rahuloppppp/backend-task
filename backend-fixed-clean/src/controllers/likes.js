
const { likePost, unlikePost, getLikesByPostId, getLikedPostsByUser } = require("../models/like");
const logger = require("../utils/logger");

/**
 * Like a post
 */
const like = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    await likePost(userId, postId);
    logger.verbose(`User ${userId} liked post ${postId}`);
    res.json({ message: "Post liked successfully" });
  } catch (err) {
    logger.critical("Like error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unlike a post
 */
const unlike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    await unlikePost(userId, postId);
    logger.verbose(`User ${userId} unliked post ${postId}`);
    res.json({ message: "Post unliked successfully" });
  } catch (err) {
    logger.critical("Unlike error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get likes on a post
 */
const getPostLikes = async (req, res) => {
  try {
    const postId = parseInt(req.params.post_id);
    const likes = await getLikesByPostId(postId);
    res.json({ likes });
  } catch (err) {
    logger.critical("Get post likes error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts liked by user
 */
const getUserLikes = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    const likedPosts = await getLikedPostsByUser(userId);
    res.json({ likedPosts });
  } catch (err) {
    logger.critical("Get user likes error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  like,
  unlike,
  getPostLikes,
  getUserLikes,
};
