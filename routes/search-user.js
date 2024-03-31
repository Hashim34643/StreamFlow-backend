const express = require('express');
const searchStreamersController = require('../controllers/search-user');
const searchStreamersRouter = express.Router();

searchStreamersRouter.post('/search/users', searchStreamersController);

module.exports = searchStreamersRouter;
