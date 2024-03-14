const express = require("express");
const sendMessageController = require("../controllers/send-message");
const sendMessageRouter = express.Router();

sendMessageRouter.post("/:streamId/send-message", sendMessageController);

module.exports = sendMessageRouter;