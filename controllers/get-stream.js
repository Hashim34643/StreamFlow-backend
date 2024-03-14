const Stream = require("../models/stream");

const getStreamById = async (req, res) => {
    const { streamId } = req.params;

    try {
        const stream = await Stream.findById(streamId);
        if (!stream) {
            return res.status(404).json({ success: false, message: "Stream not found" });
        }
        res.status(200).json({ success: true, stream });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving stream"});
    }
}

module.exports = getStreamById;