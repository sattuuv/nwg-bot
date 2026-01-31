const { Events } = require('discord.js');
const ReactionMessage = require('../models/ReactionMessage');

module.exports = {
    name: Events.MessageReactionRemove,
    async execute(reaction, user, client) {
        if (user.bot) return;

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        const { message, emoji } = reaction;

        const config = await ReactionMessage.findOne({ messageId: message.id });
        if (!config) return;

        const targetRole = config.roles.find(r => {
            if (r.emoji === emoji.name) return true;
            if (r.emoji === emoji.id) return true;
            return false;
        });

        if (targetRole) {
            const guild = message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(targetRole.roleId);

            if (role && member) {
                try {
                    await member.roles.remove(role);
                } catch (err) {
                    console.error('Failed to remove reaction role:', err);
                }
            }
        }
    }
};
