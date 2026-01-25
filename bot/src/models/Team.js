const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    cleanName: { type: String, lowercase: true, index: true }, // for search
    captainId: { type: String, required: true },
    logo: { type: String, default: null },
    members: [{ type: String }], // Array of User IDs
    stats: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', TeamSchema);
