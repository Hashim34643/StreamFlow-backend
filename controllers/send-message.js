const jwt = require("jsonwebtoken");
const Message = require("../models/send-message");
const User = require("../models/create-user");
const Stream = require("../models/stream");

const sendMessage = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId;

    const { streamId } = req.params;
    const { content } = req.body;

    if (content && content.trim().length === 0) {
        return res.status(400).json({success: false, message: "Comment cannot be empty"})
    }

    const user = await User.findById(userIdFromToken);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const stream = await Stream.findById(streamId);
    if (!stream) {
        return res.status(404).json({ success: false, message: "Stream not found" });
    }

    if (!stream.liveStatus) {
        return res.status(400).json({ success: false, message: "Stream is not live" });
    }


    try {
        const message = new Message({
            streamId,
            userId: userIdFromToken,
            content,
            timestamp: new Date()
        });

        await message.save();

        res.status(200).json({ success: true, message: "Message sent successfully", data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};

module.exports = sendMessage;

