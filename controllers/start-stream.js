const User = require('../models/create-user');
const jwt = require("jsonwebtoken");

const startStream = async (req, res) => {
    const { userId } = req.params;
    const { streamTitle, streamDescription } = req.body;

    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "No authorization token provided" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;

    if (userIdFromToken !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only start a stream for your own account" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                liveStatus: true,
                isStreaming: true,
                streamTitle: streamTitle || "Untitled Stream",
                streamDescription: streamDescription || "",
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Stream started successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error starting stream", error: error.message });
    }
};

module.exports = startStream;
