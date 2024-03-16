const Stream = require('../models/stream');
const jwt = require("jsonwebtoken");

const enterStream = async (req, res) => {
    const { streamId, userId } = req.params;

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;
    if (userIdFromToken !== userId) {
      return res.status(404).json({ success: false, message: "Unauthorized: You cannot access this content from this account" });
    }
    try {
        const stream = await Stream.findById(streamId);

        if (!stream) return res.status(404).json({ success: false, message: "Stream not found" });

        if (stream.inStream.includes(userIdFromToken)) {
            return res.status(200).json({ success: true, message: "Already in stream", stream });
        } else {
            stream.inStream.push(userIdFromToken);
            stream.streamViews += 1;
            await stream.save();

            res.status(200).json({ success: true, message: "Entered stream successfully", stream });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error entering stream", error: error.toString() });
    }
};

module.exports = enterStream;