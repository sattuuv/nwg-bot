const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = {
    name: 'announce',
    description: 'Send a custom announcement to a channel',
    options: [
        { name: 'channel', description: 'Where to post?', type: 7, required: true }, // Channel
        { name: 'title', description: 'Announcement Title', type: 3, required: true },
        { name: 'message', description: 'The main content (supports basic markdown)', type: 3, required: true },
        { name: 'color', description: 'Hex color (e.g., #FF0000) or Gold/Red/Blue', type: 3, required: false },
        { name: 'image', description: 'Image URL', type: 3, required: false },
        { name: 'ping', description: 'Who to ping?', type: 3, required: false, choices: [{ name: '@everyone', value: '@everyone' }, { name: '@here', value: '@here' }] }
    ],

    async run(client, interaction) {
        if (!checkAdmin(interaction)) {
            return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');
        const color = interaction.options.getString('color') || '#FFD700';
        const image = interaction.options.getString('image');
        const ping = interaction.options.getString('ping');

        // Validate Channel Type (Text or News)
        if (!channel.isTextBased()) {
            return interaction.reply({ content: '❌ Please select a text channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message.split('\\n').join('\n')) // Allow newlines
            .setColor(color)
            .setFooter({ text: `Published by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        if (image) {
            try {
                embed.setImage(image);
            } catch (e) {
                // Ignore invalid URL
            }
        }

        try {
            await channel.send({ content: ping ? ping : null, embeds: [embed] });
            return interaction.reply({ content: `✅ Announcement sent to ${channel}!`, ephemeral: true });
        } catch (error) {
            return interaction.reply({ content: '❌ I do not have permission to send messages in that channel.', ephemeral: true });
        }
    }
};
