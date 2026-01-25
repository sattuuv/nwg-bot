const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'scrims',
    description: 'Manage scrims',
    options: [
        {
            name: 'find',
            description: 'Post a Looking For Scrim (LFS) request',
            type: 1,
            options: [
                { name: 'game', description: 'Game (e.g. PUBG, COD)', type: 3, required: true },
                { name: 'time', description: 'Time (e.g. 8:00 PM)', type: 3, required: true },
                { name: 'slots', description: 'Open slots', type: 4, required: true }
            ]
        },
        {
            name: 'results',
            description: 'Post scrim results',
            type: 1,
            options: [
                { name: 'screenshot', description: 'Result Screenshot', type: 11, required: true }
            ]
        }
    ],

    async run(client, interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'find') {
            const game = interaction.options.getString('game');
            const time = interaction.options.getString('time');
            const slots = interaction.options.getInteger('slots');

            const embed = new EmbedBuilder()
                .setTitle(`⚔️ LFS: ${game}`)
                .setDescription(`**Time**: ${time}\n**Slots**: ${slots}\n**Host**: ${interaction.user}`)
                .setColor('Red')
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('dm_host').setLabel('DM Host').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('claim_slot').setLabel('Claim Slot').setStyle(ButtonStyle.Success)
            );

            // In reality, you'd post this to a specific #scrims channel.
            // For now, reply here.
            await interaction.reply({ content: 'Scrim Ad Posted!', ephemeral: true });
            return interaction.channel.send({ embeds: [embed], components: [row] });
        }

        if (sub === 'results') {
            const attachment = interaction.options.getAttachment('screenshot');
            const embed = new EmbedBuilder()
                .setTitle(`📊 Scrim Result`)
                .setImage(attachment.url)
                .setDescription(`Posted by ${interaction.user}`)
                .setColor('Yellow');

            return interaction.reply({ embeds: [embed] });
        }
    }
};
