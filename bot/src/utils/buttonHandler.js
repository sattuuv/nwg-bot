const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Post = require('../models/Post');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team'); // We might use this model or just raw data

module.exports = async (client, interaction) => {
    const customId = interaction.customId;

    // --- TOURNAMENT JOIN (Display Modal) ---
    if (customId.startsWith('join_tournament_')) {
        const tournamentId = customId.split('_')[2];

        // Fetch tournament
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return interaction.reply({ content: '❌ Tournament not found or ended.', ephemeral: true });

        if (tournament.participants.length >= tournament.maxTeams) {
            return interaction.reply({ content: '❌ Tournament is full!', ephemeral: true });
        }

        const mode = tournament.mode; // Solo, Duo, Squad

        // Helper to create inputs
        const modal = new ModalBuilder()
            .setCustomId(`submit_join_${tournamentId}`)
            .setTitle(`Reg: ${tournament.name} (${mode})`);

        const teamNameInput = new TextInputBuilder()
            .setCustomId('teamName')
            .setLabel("Team Name")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const rows = [new ActionRowBuilder().addComponents(teamNameInput)];

        // Dynamic Inputs based on Mode
        if (mode === 'Duo') {
            const mate1 = new TextInputBuilder().setCustomId('mate1').setLabel("Teammate 1 (Tag/ID)").setStyle(TextInputStyle.Short).setRequired(true);
            rows.push(new ActionRowBuilder().addComponents(mate1));
        }
        else if (mode === 'Squad') {
            const members = new TextInputBuilder()
                .setCustomId('squad_members')
                .setLabel("Teammates (Tag 3-4 players)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Player2, Player3, Player4...")
                .setRequired(true);
            rows.push(new ActionRowBuilder().addComponents(members));
        }
        // Solo: No extra inputs needed (User is the player)

        modal.addComponents(...rows);

        await interaction.showModal(modal);
        return;
    }

    // ... (Existing Ticket/Scrim Logic) ...
};
