const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Guild = require('../models/Guild');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) return;
        if (!message.guild) return;

        // Fetch Guild Config
        const guildData = await Guild.findOne({ guildId: message.guild.id });
        if (!guildData) return;

        const modConfig = guildData.modules?.moderation;

        // Check if Moderation is enabled
        if (modConfig?.enabled) {

            // Bad Words Filter
            if (modConfig.badWordsFilter && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                const badWords = ['badword1', 'badword2', 'scam', 'spam']; // Replace with DB list later
                const content = message.content.toLowerCase();

                if (badWords.some(word => content.includes(word))) {
                    try {
                        await message.delete();
                        const warning = await message.channel.send(`${message.author}, watch your language! ⚠️`);
                        setTimeout(() => warning.delete(), 5000);

                        // Log if channel is set
                        if (modConfig.logChannelId) {
                            const logChannel = message.guild.channels.cache.get(modConfig.logChannelId);
                            if (logChannel) {
                                const embed = new EmbedBuilder()
                                    .setTitle('Auto-Mod Action')
                                    .setColor('Red')
                                    .addFields(
                                        { name: 'User', value: `${message.author.tag} (${message.author.id})` },
                                        { name: 'Reason', value: 'Bad Word Usage' },
                                        { name: 'Message', value: message.content }
                                    )
                                    .setTimestamp();
                                logChannel.send({ embeds: [embed] });
                            }
                        }
                    } catch (err) {
                        console.error('Auto-mod error:', err);
                    }
                }
            }
        }
    }
};
