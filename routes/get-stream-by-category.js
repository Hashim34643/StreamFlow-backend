const express = require('express');
const getStreamsByCategoryController = require('../controllers/get-stream-by-category');
const getStreamsByCategoryRouter = express.Router();

getStreamsByCategoryRouter.get('/streams/:category', getStreamsByCategoryController);

module.exports = getStreamsByCategoryRouter;
