const jwt = require("jsonwebtoken");
const Message = require("../models/send-message");

const deleteMessage = async (req, res) => {
    const { userId, messageId } = req.params;

    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId;

    if (userIdFromToken !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only delete your own messages" });
    }

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        if (message.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized: You can only delete your own messages" });
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting message", error: error.message });
    }
};

module.exports = deleteMessage;
