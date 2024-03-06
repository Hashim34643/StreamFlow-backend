const createUserModel = require("../models/create-user");

const createUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, confirmPassword } = req.body;
        const isNewEmail = await createUserModel.isThisEmailInUse(email);
        if (!isNewEmail) {
            return res.status(400).json({success: false, message: "This email is already in use try sign-in"})
        }
        const isNewUsername = await createUserModel.isThisUsernameInUse(username);
        if (!isNewUsername) {
            return res.status(400).json({success: false, message: "This username is already in use try sign-in"})
        }
        const newUser = new createUserModel({
            username: username.toLowerCase(),
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            confirmPassword
        });
        await newUser.save();
        res.status(200).json({success: true, message: "User created successfully", userId: newUser._id });
    } catch(error) {
        if (error.message.includes("E11000")) {
            res.status(400).json({success: false, message: "This username is already in use try sign-in"})
            return;
        }
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

module.exports = createUser;