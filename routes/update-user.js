const express = require('express');
const updateUserController = require('../controllers/update-user');
const isAuth = require("../middleware/auth");
const updateUserRouter = express.Router();

updateUserRouter.patch('/update-user/:userId', isAuth, updateUserController);

module.exports = updateUserRouter;
