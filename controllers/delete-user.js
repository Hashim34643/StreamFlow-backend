const User = require('../models/create-user');
const jwt = require('jsonwebtoken');

const deleteAccount = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "No authorization token provided" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;
    const { userId } = req.params;

    if (userIdFromToken !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only delete your own account" });
    }

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting account", error: error.message });
    }
};

module.exports = deleteAccount;
