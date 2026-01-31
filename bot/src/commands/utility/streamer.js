const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Streamer = require('../../models/Streamer');
const axios = require('axios'); // We need axios to fetch channel ID if user gives link (optional, or we ask for ID)

// Helper to extract Channel ID from link (Simple regex)
function extractChannelId(url) {
    // Supports: youtube.com/channel/ID
    const match = url.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    return null;
}

module.exports = {
    name: 'streamer',
    description: 'Manage Streamer Notifications',
    options: [
        {
            name: 'add',
            description: 'Add a YouTube channel to monitor',
            type: 1,
            options: [
                { name: 'link', description: 'YouTube Channel Link (Must contain /channel/ID)', type: 3, required: true },
                { name: 'channel', description: 'Discord Channel for notifications', type: 7, required: true },
                { name: 'role', description: 'Role to ping (optional)', type: 8, required: false }
            ]
        },
        {
            name: 'remove',
            description: 'Stop monitoring a channel',
            type: 1,
            options: [
                { name: 'link', description: 'The YouTube Link you added', type: 3, required: true }
            ]
        },
        {
            name: 'list',
            description: 'List all monitored channels',
            type: 1
        }
    ],

    async run(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: '❌ Manage Channels permission required.', ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === 'add') {
            const url = interaction.options.getString('link');
            const targetChannel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role');

            const ytChannelId = extractChannelId(url);
            if (!ytChannelId) {
                return interaction.reply({ content: '❌ Invalid Link. Please use the full link format: `https://www.youtube.com/channel/UC...` \n(If you have a custom handle like @User, please find your Channel ID in YouTube Settings -> Advanced).', ephemeral: true });
            }

            // Check if already exists
            const exists = await Streamer.findOne({ guildId: interaction.guild.id, channelId: ytChannelId });
            if (exists) {
                return interaction.reply({ content: '❌ This channel is already being monitored.', ephemeral: true });
            }

            await Streamer.create({
                guildId: interaction.guild.id,
                channelLink: url,
                channelId: ytChannelId,
                notificationChannelId: targetChannel.id,
                roleIdToPing: role ? role.id : null,
                lastContentId: 'init' // Start fresh
            });

            return interaction.reply({ content: `✅ **Added!** Monitoring [Channel](${url}). notifications will go to ${targetChannel}.`, ephemeral: true });
        }

        if (sub === 'remove') {
            const url = interaction.options.getString('link');
            const ytChannelId = extractChannelId(url);

            if (!ytChannelId) return interaction.reply({ content: '❌ Could not parse Link.', ephemeral: true });

            const result = await Streamer.deleteOne({ guildId: interaction.guild.id, channelId: ytChannelId });

            if (result.deletedCount === 0) {
                return interaction.reply({ content: '❌ Not found in database.', ephemeral: true });
            }

            return interaction.reply({ content: '✅ Removed streamer.', ephemeral: true });
        }

        if (sub === 'list') {
            const streamers = await Streamer.find({ guildId: interaction.guild.id });
            if (streamers.length === 0) return interaction.reply({ content: 'No streamers monitored.', ephemeral: true });

            const list = streamers.map((s, i) => `${i + 1}. <${s.channelLink}> -> <#${s.notificationChannelId}>`).join('\n');
            return interaction.reply({ content: `**Monitored Channels:**\n${list}`, ephemeral: true });
        }
    }
};
