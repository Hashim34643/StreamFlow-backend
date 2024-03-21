const Stream = require('../models/stream');

const getAllLiveStreams = async (req, res) => {
    try {
        const liveStreams = await Stream.find({ liveStatus: true });

        if (liveStreams.length === 0) {
            return res.status(404).json({ success: false, message: "No live streams found"});
        }

        res.status(200).json({ success: true, streams: liveStreams });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving live streams', error: error.message });
    }
};

module.exports = getAllLiveStreams;
