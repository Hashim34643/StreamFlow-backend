const express = require('express');
const getUserFollowersControllers = require('../controllers/get-followers');
const getUserFollowersRouter = express.Router();

getUserFollowersRouter.get('/followers/:userId', getUserFollowersControllers);

module.exports = getUserFollowersRouter;
