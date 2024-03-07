const express = require("express");
const getUserController = require("../controllers/get-user");
const getUserRouter = express.Router();

getUserRouter.get("/user/:userId", getUserController);

module.exports = getUserRouter;