import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    guildId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    cleanName: { type: String, lowercase: true, index: true },
    captainId: { type: String, required: true },
    members: [{ type: String }],
    stats: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
