const express = require('express');
const getStreamByIdController = require('../controllers/get-stream');
const getStreamByIdRouter = express.Router();

getStreamByIdRouter.get('/stream/:streamId', getStreamByIdController);

module.exports = getStreamByIdRouter;
