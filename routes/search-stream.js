const express = require('express');
const searchStreamController = require('../controllers/search-stream');
const searchStreamRouter = express.Router();

searchStreamRouter.post('/search', searchStreamController);

module.exports = searchStreamRouter;