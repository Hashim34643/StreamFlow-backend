const Stream = require('../models/stream');

const searchStreams = async (req, res) => {
    const { searchTerm } = req.body;

    try {
        const streams = await Stream.find({
            streamTitle: { $regex: new RegExp(searchTerm, 'i') },
            liveStatus: true
        }).select('_id streamTitle streamDescription category streamerUsername liveStatus');

        if (streams.length === 0) {
            return res.status(404).json({ success: false, message: "No streams found matching the search term" });
        }

        res.status(200).json({ success: true, streams });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error searching for streams", error: error.message });
    }
};

module.exports = searchStreams;
