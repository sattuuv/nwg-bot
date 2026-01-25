const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const checkAdmin = require('../../utils/checkAdmin');
const Guild = require('../../models/Guild');

module.exports = {
    name: 'setup',
    description: 'Configure server settings',
    options: [
        {
            name: 'verification',
            description: 'Create a Verification Panel',
            type: 1,
            options: [
                { name: 'role', description: 'Role to give when verified', type: 8, required: true },
                { name: 'channel', description: 'Channel to post panel', type: 7, required: true }
            ]
        },
        {
            name: 'autorole',
            description: 'Set a role given AUTOMATICALLY on join',
            type: 1,
            options: [
                { name: 'role', description: 'Role to give', type: 8, required: true }
            ]
        }
    ],

    async run(client, interaction) {
        if (!checkAdmin(interaction)) {
            return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        // Ensure DB entry exists
        let guildData = await Guild.findOne({ guildId });
        if (!guildData) guildData = new Guild({ guildId });

        if (sub === 'verification') {
            const role = interaction.options.getRole('role');
            const channel = interaction.options.getChannel('channel');

            if (!channel.isTextBased()) return interaction.reply({ content: '❌ Invalid channel.', ephemeral: true });

            // 1. Save Role ID to DB
            guildData.verificationRoleId = role.id;
            await guildData.save();

            // 2. Create Panel
            const embed = new EmbedBuilder()
                .setTitle('🔒 Server Verification')
                .setDescription('Please click the button below to access the server.')
                .setColor('Green')
                .setFooter({ text: 'Anti-Raid System' });

            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_user')
                    .setLabel('Verify Me')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅')
            );

            await channel.send({ embeds: [embed], components: [button] });
            return interaction.reply({ content: `✅ Verification Panel setup in ${channel}. Role: ${role}`, ephemeral: true });
        }

        if (sub === 'autorole') {
            const role = interaction.options.getRole('role');

            // Save to DB
            guildData.autoRoleId = role.id;
            await guildData.save();

            return interaction.reply({ content: `✅ **Auto-Role** updated. New members will get: ${role}`, ephemeral: true });
        }
    }
};
