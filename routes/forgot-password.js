const express = require("express");
const forgotPasswordController = require("../controllers/forgot-password");

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/forgot-password", forgotPasswordController);

module.exports = forgotPasswordRouter;
