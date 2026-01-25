const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Team = require('../../models/Team');
const User = require('../../models/User');

module.exports = {
    name: 'team',
    description: 'Manage your esports team',
    options: [
        {
            name: 'create',
            description: 'Create a new team',
            type: 1, // Subcommand
            options: [
                { name: 'name', description: 'Team Name', type: 3, required: true },
                { name: 'logo', description: 'URL to team logo', type: 3, required: false }
            ]
        },
        {
            name: 'info',
            description: 'View team info',
            type: 1,
            options: [
                { name: 'team', description: 'Team Name (Optional, defaults to yours)', type: 3, required: false }
            ]
        },
        {
            name: 'invite',
            description: 'Invite a player to your team',
            type: 1,
            options: [
                { name: 'user', description: 'User to invite', type: 6, required: true }
            ]
        }
    ],

    async run(client, interaction) {
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (sub === 'create') {
            const name = interaction.options.getString('name');
            const logo = interaction.options.getString('logo');

            // Check if user already leads a team or is in one (optional logic, keeping simple for now)
            const existingTeam = await Team.findOne({ $or: [{ name: name }, { captainId: userId }] });
            if (existingTeam) {
                return interaction.reply({ content: 'Team name taken or you already own a team!', ephemeral: true });
            }

            const newTeam = new Team({
                name,
                cleanName: name.toLowerCase(),
                captainId: userId,
                logo,
                members: [userId]
            });

            await newTeam.save();

            // Link user to team
            await User.findOneAndUpdate(
                { userId },
                { userId, teamId: newTeam._id, $setOnInsert: { username: interaction.user.username } },
                { upsert: true, new: true }
            );

            const embed = new EmbedBuilder()
                .setTitle(`Team Created: ${name}`)
                .setDescription(`Successfully created team **${name}**!`)
                .setThumbnail(logo || interaction.user.displayAvatarURL())
                .setColor('Green');

            return interaction.reply({ embeds: [embed] });
        }

        if (sub === 'info') {
            const teamName = interaction.options.getString('team');
            let team;

            if (teamName) {
                team = await Team.findOne({ cleanName: teamName.toLowerCase() });
            } else {
                // Find user's team
                const userProfile = await User.findOne({ userId });
                if (userProfile?.teamId) {
                    team = await Team.findById(userProfile.teamId);
                }
            }

            if (!team) return interaction.reply({ content: 'Team not found!', ephemeral: true });

            const embed = new EmbedBuilder()
                .setTitle(`Team: ${team.name}`)
                .addFields(
                    { name: 'Captain', value: `<@${team.captainId}>`, inline: true },
                    { name: 'Members', value: `${team.members.length}`, inline: true },
                    { name: 'Wins/Losses', value: `${team.stats.wins}W / ${team.stats.losses}L`, inline: true }
                )
                .setColor('Blue');

            if (team.logo) embed.setThumbnail(team.logo);

            return interaction.reply({ embeds: [embed] });
        }

        // TODO: Implement 'invite' (requires button interaction handling usually, simpler version: direct add if simple)
        if (sub === 'invite') {
            return interaction.reply({ content: 'Invite system coming soon (requires interaction handling)!', ephemeral: true });
        }
    }
};
