const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'automod',
    description: 'Configure Auto-Moderation',
    options: [
        {
            name: 'badwords',
            description: 'Toggle bad word filter',
            type: 1,
            options: [
                { name: 'enable', description: 'Enable/Disable', type: 5, required: true }
            ]
        }
    ],

    async run(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Admin Only.', ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === 'badwords') {
            const enabled = interaction.options.getBoolean('enable');
            // Save to DB (mocked for now)
            return interaction.reply({ content: `✅ AutoMod Bad Words Filter is now **${enabled ? 'ENABLED' : 'DISABLED'}**.` });
        }
    }
};
