const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const { create, getById, feed } = require("../controllers/posts");

// Create a new post
router.post("/", authMiddleware, create);

// Get a single post by ID
router.get("/:id", authMiddleware, getById);

// Get feed (followed + own posts)
router.get("/feed", authMiddleware, feed);

module.exports = router;
