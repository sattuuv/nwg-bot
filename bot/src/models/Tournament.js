const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    game: { type: String, required: true }, // e.g., "PUBG Mobile", "Valorant"
    mode: { type: String, enum: ['Solo', 'Duo', 'Squad'], default: 'Squad' },
    status: { type: String, enum: ['Open', 'Ongoing', 'Completed', 'Cancelled'], default: 'Open' },
    maxTeams: { type: Number, default: 16 },
    prizePool: { type: String, default: "None" },
    entryFee: { type: Number, default: 0 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    channelId: { type: String }, // Discord channel for updates
    createdBy: { type: String }, // Admin ID
    createdAt: { type: Date, default: Date.now },
    startTime: { type: Date }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
