const express = require('express');
const searchStreamersController = require('../controllers/search-user');
const searchStreamersRouter = express.Router();

searchStreamersRouter.post('/search', searchStreamersController);

module.exports = searchStreamersRouter;
