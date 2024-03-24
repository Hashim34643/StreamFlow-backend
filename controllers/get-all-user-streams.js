const Stream = require('../models/stream');

const getUserStreams = async (req, res) => {
  try {
    const userId = req.params.userId;
    const streams = await Stream.find({ userId }).sort({ createdAt: -1 }).exec();
    res.json({ success: true, streams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving streams' });
  }
};

module.exports = getUserStreams;
