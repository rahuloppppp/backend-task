
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const usersController = require("../controllers/users");

router.post("/:id/follow", authMiddleware, usersController.follow);
router.delete("/:id/follow", authMiddleware, usersController.unfollow);
router.get("/followers", authMiddleware, usersController.getMyFollowers);
router.get("/following", authMiddleware, usersController.getMyFollowing);
router.get("/:id/stats", authMiddleware, usersController.getStats);

module.exports = router;
