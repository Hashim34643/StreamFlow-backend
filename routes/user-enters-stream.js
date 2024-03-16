const express = require("express");
const enterStreamController = require("../controllers/user-enters-stream");
const isAuth = require("../middleware/auth");

const enterStreamRouter = express.Router();

enterStreamRouter.post("/:streamId/enter/:userId", isAuth, enterStreamController);

module.exports = enterStreamRouter;