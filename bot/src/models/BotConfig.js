const mongoose = require('mongoose');

const BotConfigSchema = new mongoose.Schema({
    instanceId: { type: String, default: 'global' }, // Singleton
    activityName: { type: String, default: 'NWG Tournaments' },
    activityType: { type: Number, default: 0 }, // 0=Playing, 1=Streaming, 2=Listening, 3=Watching, 5=Competing
    status: { type: String, default: 'online' }, // online, idle, dnd
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BotConfig', BotConfigSchema);
