const Stream = require('../models/stream');

const getAllLiveStreams = async (req, res) => {
    try {
        const liveStreams = await Stream.find({ liveStatus: true });
        res.status(200).json({ success: true, streams: liveStreams });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error retrieving live streams', error: error.message });
    }
};

module.exports = getAllLiveStreams;
