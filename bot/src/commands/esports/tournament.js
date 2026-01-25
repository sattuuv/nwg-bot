const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Tournament = require('../../models/Tournament');

module.exports = {
    name: 'tournament',
    description: 'Manage tournaments',
    options: [
        {
            name: 'create',
            description: 'Create a new tournament (Admin)',
            type: 1,
            options: [
                { name: 'name', description: 'Tournament Name', type: 3, required: true },
                { name: 'game', description: 'Game Title', type: 3, required: true }
            ]
        },
        {
            name: 'list',
            description: 'List active tournaments',
            type: 1
        }
    ],

    async run(client, interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'create') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: 'Admin only!', ephemeral: true });
            }

            const name = interaction.options.getString('name');
            const game = interaction.options.getString('game');

            const newTourney = new Tournament({
                name,
                game,
                createdBy: interaction.user.id,
                channelId: interaction.channelId
            });

            await newTourney.save();

            const embed = new EmbedBuilder()
                .setTitle(`🏆 Tournament Created: ${name}`)
                .setDescription(`Game: **${game}**\nJoin via website or /tournament join!`)
                .setColor('Gold');

            return interaction.reply({ embeds: [embed] });
        }

        if (sub === 'list') {
            const tourneys = await Tournament.find({ status: { $ne: 'Completed' } }).limit(5);

            if (tourneys.length === 0) return interaction.reply({ content: 'No active tournaments.', ephemeral: true });

            const embed = new EmbedBuilder().setTitle('Active Tournaments');
            tourneys.forEach(t => {
                embed.addFields({ name: t.name, value: `Game: ${t.game} | Teams: ${t.participants.length}/${t.maxTeams}` });
            });

            return interaction.reply({ embeds: [embed] });
        }
    }
};
