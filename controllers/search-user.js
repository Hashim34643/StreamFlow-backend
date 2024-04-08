const User = require('../models/create-user');

const searchStreamers = async (req, res) => {
    const { searchTerm } = req.body;

    try {
        const streamers = await User.find({
            username: { $regex: new RegExp(searchTerm, 'i') },
            isStreamer: true, 
        }).select('_id username firstName lastName avatar followers');

        if (streamers.length === 0) {
            return res.status(404).json({ success: false, message: "No streamers found" });
        }
        res.status(200).json({ success: true, streamers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error searching for streamers", error: error.message });
    }
};

module.exports = searchStreamers;
