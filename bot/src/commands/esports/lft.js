const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Post = require('../../models/Post');

module.exports = {
    name: 'lft',
    description: 'Looking For Team',
    options: [
        {
            name: 'game',
            description: 'Game Name (e.g. BGMI, CODM)',
            type: 3, // STRING
            required: true
        },
        {
            name: 'role',
            description: 'My Role (e.g. Sniper, Assaulter)',
            type: 3, // STRING
            required: true
        },
        {
            name: 'experience',
            description: 'My Experience (e.g. 2 years, T1 Player)',
            type: 3, // STRING
            required: true
        },
        {
            name: 'time',
            description: 'Availability Time',
            type: 3, // STRING
            required: true
        },
        {
            name: 'info',
            description: 'Extra Info',
            type: 3, // STRING
            required: false
        }
    ],

    async run(client, interaction) {
        const game = interaction.options.getString('game');
        const role = interaction.options.getString('role');
        const exp = interaction.options.getString('experience');
        const time = interaction.options.getString('time');
        const info = interaction.options.getString('info') || 'No extra info';

        const embed = new EmbedBuilder()
            .setTitle(`🛡️ LFT: ${game}`)
            .setDescription(`**Looking for a Team!**\n\n**Role:** ${role}\n**Experience:** ${exp}\n**Availability:** ${time}\n**Info:** ${info}`)
            .addFields(
                { name: 'Player', value: `${interaction.user}`, inline: true },
                { name: 'Status', value: `Open`, inline: true }
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setColor('#0099FF')
            .setFooter({ text: 'NWG Esports • Recruit this player!', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('lft_claim') // "Claim" here means a team wants to recruit them
                .setLabel('Recruit / DM')
                .setEmoji('🤝')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('dm_host')
                .setLabel('DM Player')
                .setEmoji('📩')
                .setStyle(ButtonStyle.Secondary)
        );

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        // Save to DB
        try {
            await Post.create({
                messageId: message.id,
                channelId: interaction.channel.id,
                type: 'LFT',
                creatorId: interaction.user.id,
                maxClaims: 3
            });
        } catch (err) {
            console.error('Error saving LFT post:', err);
        }
    }
};
