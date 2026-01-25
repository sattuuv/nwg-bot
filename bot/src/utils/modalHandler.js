const { EmbedBuilder } = require('discord.js');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team'); // Ensure we require Team model

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.startsWith('submit_join_')) {
        const tournamentId = interaction.customId.split('_')[2];
        const teamName = interaction.fields.getTextInputValue('teamName');
        const teamMembersInput = interaction.fields.getTextInputValue('teamMembers');

        // Parse User IDs from mentions or raw input
        const memberIds = teamMembersInput.match(/\d{17,20}/g) || [interaction.user.id];

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return interaction.reply({ content: '❌ Tournament not found.', ephemeral: true });

        if (tournament.participants.length >= tournament.maxTeams) {
            return interaction.reply({ content: '❌ Tournament is full!', ephemeral: true });
        }

        // Create the Team
        const newTeam = new Team({
            guildId: interaction.guild.id,
            name: teamName,
            captainId: interaction.user.id,
            members: memberIds,
            cleanName: teamName.toLowerCase()
        });

        await newTeam.save();

        tournament.participants.push(newTeam._id);
        await tournament.save();

        // Notify User
        await interaction.reply({ content: `✅ **${teamName}** registered successfully for **${tournament.name}**!`, ephemeral: true });

        // Check if full AFTER registration
        if (tournament.participants.length >= tournament.maxTeams) {
            const updatedTourney = await Tournament.findById(tournamentId).populate('participants');

            const teamList = updatedTourney.participants.map((t, i) => `**${i + 1}. ${t.name}**\nCapt: <@${t.captainId}>`).join('\n\n');

            const fullEmbed = new EmbedBuilder()
                .setTitle(`🚫 Tournament Full: ${tournament.name}`)
                .setDescription(`**Registration Closed!**\n\nThe slot limit of **${tournament.maxTeams}** has been reached.\n\n**Final Team List:**\n${teamList}`)
                .setColor('Red')
                .setTimestamp();

            if (interaction.channel) {
                await interaction.channel.send({ content: `🔒 **${tournament.name}** is now FULL!`, embeds: [fullEmbed] });
            }
        }
    }
};
