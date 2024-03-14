const express = require('express');
const startStreamController = require('../controllers/start-stream');
const isAuth = require('../middleware/auth');

const startStreamRouter = express.Router();

startStreamRouter.post('/:userId/start-stream', isAuth, startStreamController);

module.exports = startStreamRouter;
