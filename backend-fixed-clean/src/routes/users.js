const logger = require("../utils/logger");

// Dummy follow logic (replace with real DB ops)
const follow = async (req, res) => {
  logger.verbose("follow called");
  res.json({ message: "follow OK" });
};
const unfollow = async (req, res) => {
  logger.verbose("unfollow called");
  res.json({ message: "unfollow OK" });
};
const getMyFollowers = async (req, res) => {
  res.json({ followers: [] });
};
const getMyFollowing = async (req, res) => {
  res.json({ following: [] });
};
const getStats = async (req, res) => {
  res.json({ stats: { followers: 0, following: 0 } });
};

// ✅ THIS is the key part causing all your issues:
module.exports = {
  follow,
  unfollow,
  getMyFollowers,
  getMyFollowing,
  getStats,
};
