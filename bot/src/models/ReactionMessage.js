const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    messageId: String,
    roles: [
        {
            emoji: String,
            roleId: String
        }
    ]
});

module.exports = mongoose.model('ReactionMessage', schema);
