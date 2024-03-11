const express = require("express");
const {createUser, followUser} = require("../controllers/create-user");
const isAuth = require("../middleware/auth");
const {validateCreateUser, userValidation} = require("../middleware/validation/create-user");

const createUserRouter = express.Router();
const followUserRouter = express.Router();

createUserRouter.post("/create-user", validateCreateUser, userValidation, createUser);
followUserRouter.post("/:userId/follow/:streamerId", isAuth, followUser);

module.exports = {createUserRouter, followUserRouter};