const express = require("express");
const getUserProfileController = require("../controllers/get-user-from-token");
const getUserProfileRouter = express.Router();
const isAuth = require("../middleware/auth");

getUserProfileRouter.get("/profile", isAuth, getUserProfileController);

module.exports = getUserProfileRouter;