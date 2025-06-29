
const { followUser, unfollowUser, getFollowers, getFollowing, getFollowStats } = require("../models/follow");
const { getUserById } = require("../models/user");
const logger = require("../utils/logger");

/**
 * Follow a user
 */
const follow = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const user = await getUserById(targetUserId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await followUser(currentUserId, targetUserId);
    logger.verbose(`User ${currentUserId} followed ${targetUserId}`);
    res.json({ message: "Followed successfully" });
  } catch (err) {
    logger.critical("Follow error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);
    const currentUserId = req.user.id;

    await unfollowUser(currentUserId, targetUserId);
    logger.verbose(`User ${currentUserId} unfollowed ${targetUserId}`);
    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    logger.critical("Unfollow error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get followers of current user
 */
const getMyFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await getFollowers(userId);
    res.json({ followers });
  } catch (err) {
    logger.critical("Get followers error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get following users of current user
 */
const getMyFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await getFollowing(userId);
    res.json({ following });
  } catch (err) {
    logger.critical("Get following error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get follow stats for a user
 */
const getStats = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);
    const stats = await getFollowStats(targetUserId);
    res.json({ stats });
  } catch (err) {
    logger.critical("Follow stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  follow,
  unfollow,
  getMyFollowers,
  getMyFollowing,
  getStats,
};
