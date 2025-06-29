
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  follow,
  unfollow,
  getMyFollowers,
  getMyFollowing,
  getStats,
} = require("../controllers/users");

router.post("/:id/follow", authMiddleware, follow);
router.delete("/:id/follow", authMiddleware, unfollow);
router.get("/followers", authMiddleware, getMyFollowers);
router.get("/following", authMiddleware, getMyFollowing);
router.get("/:id/stats", authMiddleware, getStats);

module.exports = router;
