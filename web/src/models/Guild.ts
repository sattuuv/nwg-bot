import mongoose from 'mongoose';

const GuildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },

    // Core Config
    prefix: { type: String, default: '!' },
    language: { type: String, default: 'en' },

    // Legacy fields
    welcomeChannelId: { type: String, default: null },
    modLogChannelId: { type: String, default: null },
    autoRoleId: { type: String, default: null },
    badWordsEnabled: { type: Boolean, default: false },
    announcementChannelId: { type: String, default: null },

    // New Modular System
    modules: {
        moderation: {
            enabled: { type: Boolean, default: false },
            logChannelId: { type: String, default: null },
            muteRoleId: { type: String, default: null },
            badWordsFilter: { type: Boolean, default: false }
        },
        welcome: {
            enabled: { type: Boolean, default: false },
            channelId: { type: String, default: null },
            message: { type: String, default: 'Welcome {user} to {guild}!' },
            cardEnabled: { type: Boolean, default: true }
        },
        tickets: {
            enabled: { type: Boolean, default: false },
            transcriptChannelId: { type: String, default: null },
            categoryId: { type: String, default: null },
            supportRoleId: { type: String, default: null }
        },
        esports: {
            enabled: { type: Boolean, default: false },
            managerRoleId: { type: String, default: null },
            CategoryId: { type: String, default: null }
        },
        utility: {
            enabled: { type: Boolean, default: true },
            autoRoleEnabled: { type: Boolean, default: false },
            autoRoleId: { type: String, default: null }
        }
    },

    createdAt: { type: Date, default: Date.now }
});

// Prevent overwrite during hot reload
export default mongoose.models.Guild || mongoose.model('Guild', GuildSchema);
