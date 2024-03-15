const express = require("express");
const getChatHistoryController = require("../controllers/get-chat-history");
const getChatHistoryRouter = express.Router();

getChatHistoryRouter.get("/chat/history/:streamId", getChatHistoryController);

module.exports = getChatHistoryRouter;