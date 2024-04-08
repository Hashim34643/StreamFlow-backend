const User = require('../models/create-user');
const jwt = require("jsonwebtoken");
const Stream = require("../models/stream");

const startStream = async (req, res) => {
    const { userId } = req.params;
    const { streamTitle, streamDescription, category } = req.body;

    if (!category) {
        return res.status(400).json({success: false, message: "Unable to start stream, please ensure a category is selected"});
    }

    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "No authorization token provided" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;

    if (userIdFromToken !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: You can only start a stream for your own account" });
    }

    const user = await User.findById(userId);

    if (user.liveStatus && user.isStreaming) {
        return res.status(400).json({ success: false, message: "Stream is already live" });
    }

    const startTime = new Date.now();

    const newStream = new Stream({
        userId: userId,
        streamTitle: streamTitle,
        streamDescription: streamDescription,
        category: category,
        startTime: startTime,
        liveStatus: true,
        streamerUsername: user.username,
        streamerAvatar: user.avatar,
    });

    const durationInterval = setInterval(async () => {
        const currentTime = new Date();
        const streamDuration = Math.round((currentTime - startTime) / 1000);
        await Stream.findByIdAndUpdate(newStream._id, { streamDuration: streamDuration });
    }, 60000);

    await newStream.save();

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

        res.status(200).json({ success: true, message: "Stream started successfully", user: updatedUser, streamId: newStream._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error starting stream", error: error.message });
    }
    req.on('close', () => {
        clearInterval(durationInterval);
        const endTime = new Date();
        const finalStreamDuration = Math.round((endTime - startTime) / 1000);

        Stream.findByIdAndUpdate(newStream._id, { endTime: endTime, streamDuration: finalStreamDuration }, { new: true }, (err, updatedStream) => {
            if (err) {
                console.error("Error updating stream data:", err);
            }
        });
    });
};

module.exports = startStream;
