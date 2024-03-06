const jwt = require("jsonwebtoken");
const User = require("../models/create-user");
const ForgotPassword = require("../models/forgot-password");
const sendEmail = require("../utils/send-email");

const sendForgotPasswordEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({success: false, message: "User not found"});
    };
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: "1h"});
    await ForgotPassword.create({ userId: user._id, token});
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
    await sendEmail(user.email, "Password Reset", `Click here to reset your password: ${resetLink}`);
    res.status(200).json({success: true, message: "Password reset email sent."});
}

module.exports = sendForgotPasswordEmail;