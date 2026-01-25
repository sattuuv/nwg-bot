const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ticket',
    description: 'Ticket System',
    options: [
        {
            name: 'setup',
            description: 'Post the ticket panel',
            type: 1,
            options: [
                { name: 'channel', description: 'Channel to post in', type: 7, required: true }
            ]
        }
    ],

    async run(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Admin Only.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        const embed = new EmbedBuilder()
            .setTitle('📩 NWG Support & Verify')
            .setDescription('Click a button below to open a ticket.')
            .addFields(
                { name: '🏆 Scrim Verify', value: 'Submit screenshots of scrim results', inline: true },
                { name: '🆘 Support', value: 'Get help with bot or server', inline: true },
                { name: '⚠️ Report', value: 'Report a player', inline: true }
            )
            .setColor('Blurple');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_verify').setLabel('Scrim Verify').setEmoji('🏆').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('ticket_support').setLabel('Support').setEmoji('🆘').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ticket_report').setLabel('Report').setEmoji('⚠️').setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [embed], components: [row] });
        return interaction.reply({ content: 'Ticket panel posted!', ephemeral: true });
    }
};
