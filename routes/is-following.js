const express = require("express");
const isFollowing = require("../controllers/is-following");
const isAuth = require("../middleware/auth");
const isFollowingRouter = express.Router();

isFollowingRouter.get("/:userId/isFollowing/:streamerId", isAuth, isFollowing);

module.exports = isFollowingRouter;