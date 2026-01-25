const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String },
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    dailyDefault: { type: Date, default: null },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
