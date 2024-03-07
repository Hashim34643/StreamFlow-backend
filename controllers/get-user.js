const User = require('../models/create-user');

const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User found", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user information" });
    }
};

module.exports = getUserInfo;