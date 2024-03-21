const express = require('express');
const getAllLiveStreamsController = require('../controllers/get-streams');
const getAllLiveStreamsRouter = express.Router();

getAllLiveStreamsRouter.get('/streams', getAllLiveStreamsController);

module.exports = getAllLiveStreamsRouter;
