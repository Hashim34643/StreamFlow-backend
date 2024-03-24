const express = require("express");
const getUserStreamsController = require("../controllers/get-all-user-streams");
const getUserStreamsRouter = express.Router();

getUserStreamsRouter.get("/:userId/streams", getUserStreamsController);

module.exports = getUserStreamsRouter;