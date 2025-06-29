
const {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
} = require("../models/comment");
const logger = require("../utils/logger");

/**
 * Create a comment on a post
 */
const create = async (req, res) => {
  try {
    const postId = parseInt(req.params.post_id);
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await createComment({ user_id: userId, post_id: postId, content });
    logger.verbose(`User ${userId} commented on post ${postId}`);
    res.status(201).json({ comment });
  } catch (err) {
    logger.critical("Create comment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update user's own comment
 */
const update = async (req, res) => {
  try {
    const commentId = parseInt(req.params.comment_id);
    const userId = req.user.id;
    const { content } = req.body;

    const updated = await updateComment(commentId, userId, content);
    res.json({ updated });
  } catch (err) {
    logger.critical("Update comment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete user's own comment
 */
const remove = async (req, res) => {
  try {
    const commentId = parseInt(req.params.comment_id);
    const userId = req.user.id;

    await deleteComment(commentId, userId);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    logger.critical("Delete comment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get comments for a post
 */
const getPostComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.post_id);
    const { page = 1, limit = 10 } = req.query;
    const comments = await getCommentsByPostId(postId, parseInt(page), parseInt(limit));
    res.json({ comments });
  } catch (err) {
    logger.critical("Get post comments error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  update,
  remove,
  getPostComments,
};
