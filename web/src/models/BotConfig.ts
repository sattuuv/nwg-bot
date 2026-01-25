import mongoose from 'mongoose';

const BotConfigSchema = new mongoose.Schema({
    instanceId: { type: String, default: 'global' },
    activityName: { type: String, default: 'NWG Tournaments' },
    activityType: { type: Number, default: 0 },
    status: { type: String, default: 'online' },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.BotConfig || mongoose.model('BotConfig', BotConfigSchema);
