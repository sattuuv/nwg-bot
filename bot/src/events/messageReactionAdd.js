const { Events } = require('discord.js');
const ReactionMessage = require('../models/ReactionMessage');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user, client) {
        if (user.bot) return;

        // Fetch partials if needed
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        const { message, emoji } = reaction;

        // Find configuration in DB
        const config = await ReactionMessage.findOne({ messageId: message.id });
        if (!config) return;

        // Find role for this emoji
        const emojiName = emoji.id || emoji.name; // Use ID for custom emojis, unicode for others via name? 
        // Actually, for consistency, let's normalize check
        const roleData = config.roles.find(r => r.emoji === emoji.name || r.emoji === emoji.id || r.emoji === `<:${emoji.name}:${emoji.id}>`);

        // Simpler: Just check if the stored emoji string matches either name or id or formatted
        // In the command we store interaction.options.getString('emoji') which is usually the unicode or text
        // Let's rely on finding by simple comparison or more robust parsing

        const targetRole = config.roles.find(r => {
            // If stored is unicode (e.g. 🔴), reaction.emoji.name is 🔴
            if (r.emoji === emoji.name) return true;
            // If stored is custom ID
            if (r.emoji === emoji.id) return true;
            // If stored is full custom string <a:name:id>, we need to be careful. 
            // Usually users Input simple emojis.
            return false;
        });

        if (targetRole) {
            const guild = message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(targetRole.roleId);

            if (role && member) {
                try {
                    await member.roles.add(role);
                    // Optional: DM user? No, keep it silent as per standard
                } catch (err) {
                    console.error('Failed to add reaction role:', err);
                }
            }
        }
    }
};
