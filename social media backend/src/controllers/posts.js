const {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
} = require("../models/post.js");
const { query } = require("../utils/database");
const { getPostLikeCount } = require("../models/like");
const { getPostCommentCount } = require("../models/comment");
const { hasUserLikedPost } = require("../models/like");
const logger = require("../utils/logger");

/**
 * Create a new post
 */
const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled } = req.validatedData;
    const userId = req.user.id;

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled,
    });

    logger.verbose(`User ${userId} created post ${post.id}`);

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    logger.critical("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single post by ID with like and comment counts
 */
const getById = async (req, res) => {
  try {
    const { post_id } = req.params;
    const currentUserId = req.user?.id;

    const post = await getPostById(parseInt(post_id));

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get like and comment counts
    const likeCount = await getPostLikeCount(parseInt(post_id));
    const commentCount = await getPostCommentCount(parseInt(post_id));

    // Check if current user has liked this post
    let hasLiked = false;
    if (currentUserId) {
      hasLiked = await hasUserLikedPost(currentUserId, parseInt(post_id));
    }

    res.json({ 
      post: {
        ...post,
        like_count: likeCount,
        comment_count: commentCount,
        has_liked: hasLiked
      }
    });
  } catch (error) {
    logger.critical("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts by a specific user with like and comment counts
 */
const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const currentUserId = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(parseInt(user_id), limit, offset);

    // Add like and comment counts to each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await getPostLikeCount(post.id);
        const commentCount = await getPostCommentCount(post.id);
        
        let hasLiked = false;
        if (currentUserId) {
          hasLiked = await hasUserLikedPost(currentUserId, post.id);
        }

        return {
          ...post,
          like_count: likeCount,
          comment_count: commentCount,
          has_liked: hasLiked
        };
      })
    );

    res.json({
      posts: postsWithCounts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get user posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user's posts with like and comment counts
 */
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(userId, limit, offset);

    // Add like and comment counts to each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await getPostLikeCount(post.id);
        const commentCount = await getPostCommentCount(post.id);
        
        const hasLiked = await hasUserLikedPost(userId, post.id);

        return {
          ...post,
          like_count: likeCount,
          comment_count: commentCount,
          has_liked: hasLiked
        };
      })
    );

    res.json({
      posts: postsWithCounts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get my posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get content feed - posts from users that the current user follows
 */
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get posts from followed users and current user's own posts
    const result = await query(`
      SELECT p.id, p.content, p.media_url, p.comments_enabled, p.created_at, p.updated_at,
             u.id as user_id, u.username, u.full_name as author_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE (p.user_id IN (
        SELECT following_id FROM follows WHERE follower_id = $1
      ) OR p.user_id = $1)
      AND p.is_deleted = FALSE AND u.is_deleted = FALSE
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    const posts = result.rows;

    // Add like and comment counts to each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await getPostLikeCount(post.id);
        const commentCount = await getPostCommentCount(post.id);
        const hasLiked = await hasUserLikedPost(userId, post.id);

        return {
          ...post,
          like_count: likeCount,
          comment_count: commentCount,
          has_liked: hasLiked
        };
      })
    );

    res.json({
      posts: postsWithCounts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get feed error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a post
 */
const remove = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;

    const success = await deletePost(parseInt(post_id), userId);

    if (!success) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    logger.verbose(`User ${userId} deleted post ${post_id}`);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    logger.critical("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement searchPosts controller for searching posts by content

module.exports = {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  getFeed,
  remove,
};
