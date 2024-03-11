const User = require("../models/create-user");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, confirmPassword } = req.body;
        const isNewEmail = await User.isThisEmailInUse(email);
        if (!isNewEmail) {
            return res.status(400).json({success: false, message: "This email is already in use try sign-in"})
        }
        const isNewUsername = await User.isThisUsernameInUse(username);
        if (!isNewUsername) {
            return res.status(400).json({success: false, message: "This username is already in use try sign-in"})
        }
        const newUser = new User({
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

const followUser = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({success: false, message: "No authorization token provided"});
    }
    
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;
    
    const { userId, streamerId } = req.params;
    if (userIdFromToken !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only perform actions on your own account" });
    }

    if(userId === streamerId) {
        return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }
    try {
        const user = await User.findById(userId);
        const streamer = await User.findById(streamerId);

        if (!user || !streamer) {
            return res.status(404).json({ success: false, message: "User or streamer not found" });
        }
        if (user.following.includes(streamerId)) {
            return res.status(400).json({ success: false, message: "You are already following this user" });
        }

        user.following.push(streamerId);
        streamer.followers.push(userId);

        await User.findByIdAndUpdate(userId, {$push: {following: streamerId}});
        await User.findByIdAndUpdate(streamerId, {$push: {followers: userIdFromToken}});

        res.status(200).json({ success: true, message: "Successfully followed the user" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error following user", error: error.message });
    }
};

const unfollowUser = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({success: false, message: "No authorization token provided"});
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;

    const { userId, streamerId } = req.params;

    if (userIdFromToken !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only perform actions on your own account" });
    }

    try {
        const user = await User.findById(userId);
        const streamer = await User.findById(streamerId);

        if (!user || !streamer) {
            return res.status(404).json({ success: false, message: "User or streamer not found" });
        }

        if (!user.following.includes(streamerId)) {
            return res.status(400).json({ success: false, message: "You are not following this user" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { following: streamerId } });
        await User.findByIdAndUpdate(streamerId, { $pull: { followers: userIdFromToken } });

        res.status(200).json({ success: true, message: "Successfully unfollowed the user" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error unfollowing user", error: error.message });
    }
}

module.exports = {createUser, followUser, unfollowUser};