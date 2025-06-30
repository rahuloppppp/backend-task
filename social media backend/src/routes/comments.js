const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { validateRequest, createCommentSchema, updateCommentSchema } = require("../utils/validation");
const {
    createComment,
    updateComment,
    deleteComment,
    getPostComments,
    getPostCommentCount,
    getCommentById
} = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 */

// POST /api/comments/:post_id - Create a comment on a post
router.post("/:post_id", authenticateToken, validateRequest(createCommentSchema), createComment);

// PUT /api/comments/:comment_id - Update a comment
router.put("/:comment_id", authenticateToken, validateRequest(updateCommentSchema), updateComment);

// DELETE /api/comments/:comment_id - Delete a comment
router.delete("/:comment_id", authenticateToken, deleteComment);

// GET /api/comments/:post_id - Get comments for a post
router.get("/:post_id", authenticateToken, getPostComments);

// GET /api/comments/:post_id/count - Get comment count for a post
router.get("/:post_id/count", authenticateToken, getPostCommentCount);

// GET /api/comments/single/:comment_id - Get a specific comment
router.get("/single/:comment_id", authenticateToken, getCommentById);

module.exports = router;
