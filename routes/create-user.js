const express = require("express");
const {createUser, followUser, unfollowUser} = require("../controllers/create-user");
const isAuth = require("../middleware/auth");
const {validateCreateUser, userValidation} = require("../middleware/validation/create-user");

const createUserRouter = express.Router();
const followUserRouter = express.Router();
const unfollowUserRouter = express.Router();

createUserRouter.post("/create-user", validateCreateUser, userValidation, createUser);
followUserRouter.post("/:userId/follow/:streamerId", isAuth, followUser);
unfollowUserRouter.post("/:userId/unfollow/:streamerId", isAuth, unfollowUser);

module.exports = {createUserRouter, followUserRouter, unfollowUserRouter};