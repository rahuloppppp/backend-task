
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  create,
  update,
  remove,
  getPostComments,
} = require("../controllers/comments");

router.post("/:post_id", authMiddleware, create);
router.put("/:comment_id", authMiddleware, update);
router.delete("/:comment_id", authMiddleware, remove);
router.get("/:post_id", authMiddleware, getPostComments);

module.exports = router;
