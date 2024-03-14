const express = require('express');
const deleteAccountController = require('../controllers/delete-user');
const isAuth = require('../middleware/auth');

const deleteAccountRouter = express.Router();

deleteAccountRouter.delete('/:userId/delete', isAuth, deleteAccountController);

module.exports = deleteAccountRouter;
