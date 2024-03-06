const express = require('express');
const resetPasswordController = require('../controllers/reset-password');
const resetPasswordRouter = express.Router();

resetPasswordRouter.post('/reset-password', resetPasswordController);

module.exports = resetPasswordRouter;
