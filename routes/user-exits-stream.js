const express = require("express");
const exitStreamController = require("../controllers/user-exits-stream");
const isAuth = require("../middleware/auth");

const exitStreamRouter = express.Router();

exitStreamRouter.post("/:streamId/exit/:userId", isAuth, exitStreamController);

module.exports = exitStreamRouter;