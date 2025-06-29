
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  like,
  unlike,
  getPostLikes,
  getUserLikes,
} = require("../controllers/likes");

router.post("/:post_id", authMiddleware, like);
router.delete("/:post_id", authMiddleware, unlike);
router.get("/:post_id", authMiddleware, getPostLikes);
router.get("/user/:user_id", authMiddleware, getUserLikes);

module.exports = router;
