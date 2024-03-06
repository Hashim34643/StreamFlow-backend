const User = require("../models/create-user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        };
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
};

module.exports = resetPassword;