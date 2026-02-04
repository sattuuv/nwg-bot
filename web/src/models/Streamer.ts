import mongoose from 'mongoose';

const StreamerSchema = new mongoose.Schema({
    guildId: String,
    platform: { type: String, default: 'youtube' },
    channelLink: String,
    channelName: String,
    channelId: String,
    notificationChannelId: String,
    roleIdToPing: String,
    gameRoleId: String,
    notifyType: { type: String, enum: ['all', 'live'], default: 'all' },
    lastContentId: String,
    lastCheckTime: { type: Number, default: 0 }
});

export default mongoose.models.Streamer || mongoose.model('Streamer', StreamerSchema);
