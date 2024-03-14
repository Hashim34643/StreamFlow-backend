const express = require('express');
const endStreamController = require('../controllers/end-stream');
const isAuth = require('../middleware/auth');

const endStreamRouter = express.Router();

endStreamRouter.post('/:userId/end-stream', isAuth, endStreamController);

module.exports = endStreamRouter;
