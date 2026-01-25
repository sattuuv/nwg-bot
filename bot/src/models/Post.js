const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    messageId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
    type: { type: String, required: true }, // 'LFP', 'LFT', 'SCRIM'
    creatorId: { type: String, required: true },
    maxClaims: { type: Number, default: 3 },
    claimIds: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete doc after 24h
});

module.exports = mongoose.model('Post', postSchema);
