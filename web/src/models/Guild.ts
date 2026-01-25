import mongoose from 'mongoose';

const GuildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    welcomeChannelId: { type: String, default: null },
    modLogChannelId: { type: String, default: null },
    autoRoleId: { type: String, default: null }, // Role given on join
    verificationRoleId: { type: String, default: null }, // Role given after verify click
    badWordsEnabled: { type: Boolean, default: false },
    announcementChannelId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

// Prevent overwrite during hot reload
export default mongoose.models.Guild || mongoose.model('Guild', GuildSchema);
