const mongoose = require('mongoose')

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
    liveStatus: {
        type: Boolean,
        default: false
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
    },
    inStream: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: String,
        required: true,
        enum: ['Fortnite', 'Minecraft', 'League of Legends', 'Chatting', 'In Real Life']
    }
});

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;
