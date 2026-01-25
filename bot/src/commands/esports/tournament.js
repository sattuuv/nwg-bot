const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
            name: 'end',
            description: 'End a tournament',
            type: 1,
            options: [
                { name: 'id', description: 'Tournament ID', type: 3, required: true }
            ]
        },
        {
            name: 'list',
            description: 'List active tournaments',
            type: 1
        }
    ],

    async run(client, interaction) {
        if (!interaction.guild) return interaction.reply({ content: '❌ This command can only be used in a server.', ephemeral: true });

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

            // Save first to get ID
            await newTourney.save();

            const embed = new EmbedBuilder()
                .setTitle(`🏆 New Tournament: ${name}`)
                .setDescription(`
                **Game:** ${game}
                **Mode:** ${mode}
                **Prize:** ${prize}
                **Entry Fee:** ${fee > 0 ? fee : 'Free'}
                **Slots:** 0/${slots} Teams Filled
                
                Click the button below to register your team!
                `)
                .setColor('Gold')
                .setFooter({ text: `Tournament ID: ${newTourney._id}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`join_tournament_${newTourney._id}`)
                        .setLabel('Join Tournament')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('📝')
                );

            const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

            newTourney.messageId = msg.id;
            await newTourney.save();
            return;
        }

        if (sub === 'end') {
            if (!checkAdmin(interaction)) {
                return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
            }
            const id = interaction.options.getString('id');
            const tourney = await Tournament.findById(id);

            if (!tourney) return interaction.reply({ content: '❌ Tournament not found.', ephemeral: true });

            tourney.status = 'Completed';
            await tourney.save();

            return interaction.reply({ content: `✅ Tournament **${tourney.name}** has been marked as Completed.` });
        }

        if (sub === 'list') {
            const tourneys = await Tournament.find({ status: { $ne: 'Completed' } }).limit(5);

            if (tourneys.length === 0) return interaction.reply({ content: 'No active tournaments.', ephemeral: true });

            const embed = new EmbedBuilder().setTitle('Active Tournaments');
            tourneys.forEach(t => {
                embed.addFields({ name: t.name, value: `ID: ${t._id}\nGame: ${t.game}\nSlots: ${t.participants.length}/${t.maxTeams}` });
            });

            return interaction.reply({ embeds: [embed] });
        }
    }
};
