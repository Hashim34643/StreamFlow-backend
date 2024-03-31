const express = require('express');
const searchStreamController = require('../controllers/search-stream');
const searchStreamRouter = express.Router();

searchStreamRouter.post('/search/streams', searchStreamController);

module.exports = searchStreamRouter;