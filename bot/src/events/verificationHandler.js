const { Events } = require('discord.js');
const Guild = require('../models/Guild');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'verify_user') return;

        const guildData = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildData || !guildData.verificationRoleId) {
            return interaction.reply({ content: '❌ Verification role is not set up!', ephemeral: true });
        }

        const role = interaction.guild.roles.cache.get(guildData.verificationRoleId);
        if (!role) {
            return interaction.reply({ content: '❌ Role not found! Ask admin to fix config.', ephemeral: true });
        }

        try {
            await interaction.member.roles.add(role);
            return interaction.reply({ content: '✅ **Verified!** Access granted.', ephemeral: true });
        } catch (error) {
            return interaction.reply({ content: '❌ I cannot give you the role (My role is below it).', ephemeral: true });
        }
    },
};
