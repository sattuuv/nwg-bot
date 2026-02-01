const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    guildId: String,
    platform: { type: String, default: 'youtube' },
    channelLink: String,
    channelName: String, // Scraped Name
    channelId: String, // YouTube Channel ID
    notificationChannelId: String,
    roleIdToPing: String,
    lastContentId: String,  // ID of the last video/stream announced to prevent duplicates
    lastCheckTime: { type: Number, default: 0 }
});

module.exports = mongoose.model('Streamer', schema);
