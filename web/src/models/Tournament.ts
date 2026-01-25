import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    game: { type: String, required: true },
    status: { type: String, default: 'Open' },
    maxTeams: { type: Number, default: 16 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);
