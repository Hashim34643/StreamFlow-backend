const jwt = require("jsonwebtoken");
const Message = require("../models/send-message");

const getChatMessages = async (req, res) => {
    const { streamId } = req.params;

    try {
        const messages = await Message.find({ streamId })
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to retrieve messages", error: error.message });
    }
};

module.exports = getChatMessages;
