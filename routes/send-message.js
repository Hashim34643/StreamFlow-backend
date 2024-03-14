const express = require("express");
const sendMessageController = require("../controllers/send-message");
const isAuth = require("../middleware/auth");
const sendMessageRouter = express.Router();

sendMessageRouter.post("/:streamId/send-message", isAuth, sendMessageController);

module.exports = sendMessageRouter;