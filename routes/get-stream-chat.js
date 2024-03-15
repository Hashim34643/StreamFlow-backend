const express = require("express");
const getChatMessagesController = require("../controllers/get-stream-chat");
const getChatMessagesRouter = express.Router();

getChatMessagesRouter.get("/chat/:streamId", getChatMessagesController);

module.exports = getChatMessagesRouter;