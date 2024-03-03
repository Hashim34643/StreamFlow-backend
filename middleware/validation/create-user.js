const {check, validationResult} = require("express-validator");

const validateCreateUser = [
    check("username").trim().not().isEmpty().withMessage("username cannot be empty"),
    check("firstName").trim().not().isEmpty().withMessage("First name cannot be empty"),
    check("lastName").trim().not().isEmpty().withMessage("Last name cannot be empty"),
    check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
    check("password").trim().not().isEmpty().withMessage("Password cannot be empty").isLength({min: 5}).withMessage("Password must have 5 characters minimum"),
    check("confirmPassword").trim().not().isEmpty().custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Both passwords must be the same");
        }
        return true;
    })
];

const userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    if (!result.length) {
        return next();
    }

    const error = result[0].msg;
    res.status(400).json({message: error});
};

const validateUserLogin = [
    check("email").trim().isEmail().withMessage("email / password is required"),
    check("password").trim().not().isEmpty().withMessage("email / password is required")
]

module.exports = {validateCreateUser, userValidation, validateUserLogin};