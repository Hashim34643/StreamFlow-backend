const createUserModel = require("../models/create-user");

const createUser = async (req, res) => {
    try {
        const { email, username, firstName, lastName, password, confirmPassword, bio, isStreamer, createdAt, avatar } = req.body;
        const isNewEmail = await createUserModel.isThisEmailInUse(email);
        if (!isNewEmail) {
            res.status(400).json({ success: false, message: "Email already in use, try sign-in" });
        };
        const isNewUsername = await createUserModel.isThisUsernameInUse(username);
        if (!isNewUsername) {
            res.status(400).json({ success: false, message: "Username is taken" });
        };
        const newUser = new createUserModel({
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            firstName,
            lastName,
            password,
            bio,
            isStreamer,
            createdAt,
            avatar
        });
        await newUser.save();
        res.status(201).send({ success: true, message: "User created successfully" });
    } catch(error) {
        if (error.message.includes("E11000")) {
            res.status(400).json({success: false, message: "This username is already in use try sign-in"})
            return;
        }
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

module.exports = createUser;