const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Post = require('../../models/Post');

module.exports = {
    name: 'lfp',
    description: 'Looking For Player',
    options: [
        {
            name: 'game',
            description: 'Game Name (e.g. BGMI, CODM)',
            type: 3, // STRING
            required: true
        },
        {
            name: 'type',
            description: 'Match Type (e.g. BR, CS, TDM)',
            type: 3, // STRING
            required: true
        },
        {
            name: 'role',
            description: 'Required Role (e.g. Sniper, IGL)',
            type: 3, // STRING
            required: true
        },
        {
            name: 'time',
            description: 'Match Time',
            type: 3, // STRING
            required: true
        },
        {
            name: 'matches',
            description: 'Total Matches',
            type: 4, // INTEGER
            required: false
        },
        {
            name: 'teamcode',
            description: 'Team Code (if any)',
            type: 3, // STRING
            required: false
        },
        {
            name: 'requirements',
            description: 'Any other requirements',
            type: 3, // STRING
            required: false
        }
    ],

    async run(client, interaction) {
        const game = interaction.options.getString('game');
        const type = interaction.options.getString('type');
        const role = interaction.options.getString('role');
        const time = interaction.options.getString('time');
        const matches = interaction.options.getInteger('matches') || 'N/A';
        const teamcode = interaction.options.getString('teamcode') || 'DM for Code';
        const reqs = interaction.options.getString('requirements') || 'None';

        const embed = new EmbedBuilder()
            .setTitle(`🎮 LFP: ${game} (${type})`)
            .setDescription(`**Looking for a player!**\n\n**Role:** ${role}\n**Time:** ${time}\n**Matches:** ${matches}\n**Team Code:** ${teamcode}\n**Requirements:** ${reqs}`)
            .addFields(
                { name: 'Host', value: `${interaction.user}`, inline: true },
                { name: 'Slots Filled', value: `0/3`, inline: true }
            )
            .setColor('#00FF00')
            .setFooter({ text: 'NWG Esports • Click Claim to join!', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('lfp_claim')
                .setLabel('Claim Slot')
                .setEmoji('🙋‍♂️')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('dm_host') // Reusing generic DM host button
                .setLabel('DM Host')
                .setEmoji('📩')
                .setStyle(ButtonStyle.Secondary)
        );

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        // Save to DB
        try {
            await Post.create({
                messageId: message.id,
                channelId: interaction.channel.id,
                type: 'LFP',
                creatorId: interaction.user.id,
                maxClaims: 3
            });
        } catch (err) {
            console.error('Error saving LFP post:', err);
        }
    }
};
