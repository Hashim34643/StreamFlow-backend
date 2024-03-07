const express = require('express');
const updateUserController = require('../controllers/update-user');
const updateUserRouter = express.Router();

updateUserRouter.patch('/update-user/:userId', updateUserController);

module.exports = updateUserRouter;
