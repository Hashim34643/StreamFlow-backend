const User = require('../models/create-user');

const isFollowing = async (req, res) => {
    const { userId, streamerId } = req.params;

    try {
        const user = await User.findById(userId);
        const isFollowing = user.following.includes(streamerId);
        res.status(200).json({ success: true, isFollowing });
    } catch (error) {
        console.error("Failed to check follow status", error);
        res.status(500).json({ success: false, message: "Error checking if following the streamer" });
    }
};

module.exports = isFollowing;