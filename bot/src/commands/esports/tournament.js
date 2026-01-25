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
                { name: 'game', description: 'Game Title', type: 3, required: true },
                {
                    name: 'mode',
                    description: 'Team Mode',
                    type: 3,
                    required: true,
                    choices: [
                        { name: 'Solo', value: 'Solo' },
                        { name: 'Duo', value: 'Duo' },
                        { name: 'Squad', value: 'Squad' }
                    ]
                },
                { name: 'prize', description: 'Prize Pool (e.g. $100)', type: 3, required: false },
                { name: 'slots', description: 'Max Teams (Default: 16)', type: 4, required: false },
                { name: 'entry_fee', description: 'Cost to join (Economy)', type: 4, required: false }
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

        const checkAdmin = require('../../utils/checkAdmin');

        if (sub === 'create') {
            if (!checkAdmin(interaction)) {
                return interaction.reply({ content: '❌ You need Admin permissions or the Admin Role to do this.', ephemeral: true });
            }

            const name = interaction.options.getString('name');
            const game = interaction.options.getString('game');
            const mode = interaction.options.getString('mode');
            const prize = interaction.options.getString('prize') || 'None';
            const slots = interaction.options.getInteger('slots') || 16;
            const fee = interaction.options.getInteger('entry_fee') || 0;

            const newTourney = new Tournament({
                name,
                game,
                mode,
                maxTeams: slots,
                prizePool: prize,
                entryFee: fee,
                guildId: interaction.guild.id,
                createdBy: interaction.user.id,
                channelId: interaction.channelId
            });

            await newTourney.save();

            const embed = new EmbedBuilder()
                .setTitle(`🏆 New Tournament: ${name}`)
                .setDescription(`
                **Game:** ${game}
                **Mode:** ${mode}
                **Prize:** ${prize}
                **Entry Fee:** ${fee > 0 ? fee : 'Free'}
                **Slots:** ${slots} Teams
                
                Click the button below or use \`/tournament join\`!
                `)
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
