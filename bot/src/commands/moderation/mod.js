const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = {
    name: 'mod',
    description: 'Moderation tools',
    options: [
        {
            name: 'kick',
            description: 'Kick a user',
            type: 1,
            options: [
                { name: 'user', description: 'User to kick', type: 6, required: true },
                { name: 'reason', description: 'Why?', type: 3, required: false }
            ]
        },
        {
            name: 'ban',
            description: 'Ban a user',
            type: 1,
            options: [
                { name: 'user', description: 'User to ban', type: 6, required: true },
                { name: 'reason', description: 'Why?', type: 3, required: false }
            ]
        },
        {
            name: 'timeout',
            description: 'Timeout a user',
            type: 1,
            options: [
                { name: 'user', description: 'User to mute', type: 6, required: true },
                { name: 'minutes', description: 'How many minutes?', type: 4, required: true },
                { name: 'reason', description: 'Why?', type: 3, required: false }
            ]
        },
        {
            name: 'purge',
            description: 'Delete messages',
            type: 1,
            options: [
                { name: 'amount', description: 'Number of messages (1-100)', type: 4, required: true }
            ]
        }
    ],

    async run(client, interaction) {
        if (!checkAdmin(interaction)) {
            return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === 'purge') {
            const amount = interaction.options.getInteger('amount');
            if (amount > 100 || amount < 1) return interaction.reply({ content: '❌ Limit is 1-100 messages.', ephemeral: true });

            await interaction.channel.bulkDelete(amount, true);
            return interaction.reply({ content: `🧹 Deleted ${amount} messages.`, ephemeral: true });
        }

        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
        if (!target.manageable) return interaction.reply({ content: '❌ I cannot moderate this user (Role too high).', ephemeral: true });

        if (sub === 'kick') {
            await target.kick(reason);
            return interaction.reply({ content: `🦶 **${target.user.tag}** was kicked.\nReason: ${reason}` });
        }

        if (sub === 'ban') {
            await target.ban({ reason });
            return interaction.reply({ content: `🔨 **${target.user.tag}** was BANNED.\nReason: ${reason}` });
        }

        if (sub === 'timeout') {
            const minutes = interaction.options.getInteger('minutes');
            await target.timeout(minutes * 60 * 1000, reason);
            return interaction.reply({ content: `😶 **${target.user.tag}** is muted for ${minutes} minutes.\nReason: ${reason}` });
        }
    }
};
