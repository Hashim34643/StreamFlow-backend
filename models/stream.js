const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    },
    streamTitle: { 
        type: String, required: true 
    },
    streamDescription: {
        type: String 
    },
    startTime: {
        type: Date, default: Date.now 
    },
    endTime: { 
        Date 
    },
    streamDuration: {
        type: Number, default: 0 
    },
    streamViews: {
        type: Number, default: 0
    }
});

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;
