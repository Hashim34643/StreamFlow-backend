const Stream = require('../models/stream');

const getStreamsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const streams = await Stream.find({ category: { $regex: new RegExp(category, 'i') }, liveStatus: true }).exec();

        if (streams.length > 0) {
            res.status(200).json({ success: true, streams });
        } else {
            res.status(404).json({ success: false, message: "No streams found in this category" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving streams", error: error.message });
    }
};

module.exports = getStreamsByCategory;

