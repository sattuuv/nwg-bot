const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Post = require('../models/Post');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team'); // We might use this model or just raw data

module.exports = async (client, interaction) => {
    const customId = interaction.customId;

    // --- TOURNAMENT JOIN (Display Modal) ---
    if (customId.startsWith('join_tournament_')) {
        const tournamentId = customId.split('_')[2];

        // Fetch tournament to make sure it exists/isn't full
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return interaction.reply({ content: '❌ Tournament not found or ended.', ephemeral: true });

        if (tournament.participants.length >= tournament.maxTeams) {
            return interaction.reply({ content: '❌ Tournament is full!', ephemeral: true });
        }

        // Show Modal
        const modal = new ModalBuilder()
            .setCustomId(`submit_join_${tournamentId}`)
            .setTitle('Register for Tournament');

        const teamNameInput = new TextInputBuilder()
            .setCustomId('teamName')
            .setLabel("Team Name")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const membersInput = new TextInputBuilder()
            .setCustomId('teamMembers')
            .setLabel("Team Members (Tag or Name)")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Player1, Player2, Player3...")
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(teamNameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(membersInput);

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
        return;
    }

    // ... (Existing Ticket/Scrim Logic) ...
};
