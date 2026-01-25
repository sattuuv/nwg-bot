const { EmbedBuilder } = require('discord.js');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team'); // Ensure we require Team model

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.startsWith('submit_join_')) {
        const tournamentId = interaction.customId.split('_')[2];
        const teamName = interaction.fields.getTextInputValue('teamName');

        // Dynamic Member Parsing
        let memberString = "";
        try { memberString += interaction.fields.getTextInputValue('mate1') + " "; } catch (e) { }
        try { memberString += interaction.fields.getTextInputValue('squad_members') + " "; } catch (e) { }

        // Always include self (Captain)
        const memberIds = memberString.match(/\d{17,20}/g) || [];
        if (!memberIds.includes(interaction.user.id)) memberIds.unshift(interaction.user.id);

        const tournament = await Tournament.findById(tournamentId).populate('participants');
        if (!tournament) return interaction.reply({ content: '❌ Tournament not found.', ephemeral: true });

        // Check if User is already in this tournament
        const alreadyJoined = tournament.participants.some(t =>
            t.captainId === interaction.user.id || t.members.includes(interaction.user.id)
        );

        if (alreadyJoined) {
            return interaction.reply({ content: '❌ You have already joined this tournament!', ephemeral: true });
        }

        // Also check new members (optional but good)
        // For strictness, we check if ANY of the new members are already in too.
        for (const newMemberId of memberIds) {
            const memberExists = tournament.participants.some(t =>
                t.captainId === newMemberId || t.members.includes(newMemberId)
            );
            if (memberExists) {
                return interaction.reply({ content: `❌ User <@${newMemberId}> is already registered in another team!`, ephemeral: true });
            }
        }

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

        // Update Original Embed (Live Slots)
        if (tournament.channelId && tournament.messageId) {
            try {
                const channel = await client.channels.fetch(tournament.channelId);
                const msg = await channel.messages.fetch(tournament.messageId);
                if (msg) {
                    const embed = EmbedBuilder.from(msg.embeds[0]);
                    const currentFilled = tournament.participants.length;
                    const max = tournament.maxTeams;

                    // Regex replace the Slots Description
                    const desc = embed.data.description.replace(/Slots: \d+\/\d+/, `Slots: ${currentFilled}/${max}`);
                    embed.setDescription(desc);

                    await msg.edit({ embeds: [embed] });
                }
            } catch (err) {
                console.error("Could not update live tournament embed:", err);
            }
        }

        // Notify User
        await interaction.reply({ content: `✅ **${teamName}** registered for **${tournament.name}**! (${tournament.participants.length}/${tournament.maxTeams} Slots)`, ephemeral: true });

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
