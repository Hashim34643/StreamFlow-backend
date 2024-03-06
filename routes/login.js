const express = require("express");
const loginController = require("../controllers/login");
const {validateUserLogin, userValidation} = require("../middleware/validation/create-user");
const isAuth = require("../middleware/auth");

const loginRouter = express.Router();

loginRouter.post("/login", validateUserLogin, userValidation, loginController);
loginRouter.post("/create-post", isAuth, (req, res) => {
    res.send("welcome!")
})

module.exports = loginRouter;