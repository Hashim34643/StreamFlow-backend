const Stream = require('../models/stream');
const jwt = require("jsonwebtoken");

const leaveStream = async (req, res) => {
    const { streamId, userId } = req.params;

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;

    if (userIdFromToken !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized: You cannot perform this action from this account" });
    }

    try {
        const stream = await Stream.findById(streamId);
        if (!stream) return res.status(404).json({ success: false, message: "Stream not found" });

        if (stream.inStream.includes(userId)) {
            stream.inStream = stream.inStream.filter(id => !id.equals(userId));
            stream.currentViewers = Math.max(0, stream.currentViewers - 1);
            await stream.save();
        }

        res.status(200).json({ success: true, message: "Left stream successfully", stream });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error leaving stream", error: error.toString() });
    }
};

module.exports = leaveStream;