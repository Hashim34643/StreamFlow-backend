const Message = require('../models/send-message');

const getChatHistory = async (req, res) => {
    const { streamId } = req.params;

    try {
        const messages = await Message.find({ streamId }).sort({ timestamp: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving chat history", error: error.message });
    }
};

module.exports = getChatHistory;
