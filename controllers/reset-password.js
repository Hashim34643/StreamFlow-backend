const User = require("../models/create-user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        const user = await User.findByIdAndUpdate(decoded.userId, { $set: { password: hashedPassword } }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        };
        const isMatch = await user.comparePassword(newPassword);
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
};

module.exports = resetPassword;