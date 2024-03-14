const User = require('../models/create-user');
const jwt = require("jsonwebtoken");

const endStream = async (req, res) => {
    const { userId } = req.params;

    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "No authorization token provided" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;

    if (userIdFromToken !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only end a stream for your own account" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                liveStatus: false,
                isStreaming: false,
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Stream ended successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error ending stream", error: error.message });
    }
};

module.exports = endStream;
