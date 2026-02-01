const Parser = require('rss-parser');
const parser = new Parser();

// Helper to extract Channel ID from link (Simple regex)
function extractChannelId(url) {
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
                { name: 'role', description: 'Streamer Role to ping (e.g. @PewDiePie Fans)', type: 8, required: false },
                { name: 'game_role', description: 'Game Role to ping (e.g. @Valorant)', type: 8, required: false }
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
            await interaction.deferReply({ ephemeral: true }); // Defer because fetching RSS takes time
            const url = interaction.options.getString('link');
            const targetChannel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role');
            const gameRole = interaction.options.getRole('game_role');

            const ytChannelId = extractChannelId(url);
            if (!ytChannelId) {
                return interaction.editReply({ content: '❌ Invalid Link. Please use the full link format: `https://www.youtube.com/channel/UC...` \n(If you have a custom handle like @User, please find your Channel ID in YouTube Settings -> Advanced).' });
            }

            // Check if already exists
            const exists = await Streamer.findOne({ guildId: interaction.guild.id, channelId: ytChannelId });
            if (exists) {
                return interaction.editReply({ content: '❌ This channel is already being monitored.' });
            }

            // Fetch Channel Name for better UI
            let channelName = 'Unknown Channel';
            try {
                const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${ytChannelId}`);
                if (feed && feed.title) channelName = feed.title;
            } catch (e) {
                console.log('Could not fetch channel name:', e.message);
            }

            await Streamer.create({
                guildId: interaction.guild.id,
                channelLink: url,
                channelName: channelName,
                channelId: ytChannelId,
                notificationChannelId: targetChannel.id,
                roleIdToPing: role ? role.id : null,
                gameRoleId: gameRole ? gameRole.id : null,
                lastContentId: 'init' // Start fresh
            });

            return interaction.editReply({ content: `✅ **Added!** Monitoring **${channelName}** (<${url}>).\nNotifications will go to ${targetChannel}.` });
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

            const list = streamers.map((s, i) => {
                const name = s.channelName || 'YouTube Channel';
                const role1 = s.roleIdToPing ? `<@&${s.roleIdToPing}>` : '';
                const role2 = s.gameRoleId ? `<@&${s.gameRoleId}>` : '';
                const pings = [role1, role2].filter(Boolean).join(' ');

                return `${i + 1}. **${name}**\n   🔗 <${s.channelLink}>\n   📢 <#${s.notificationChannelId}> ${pings ? `(Pings: ${pings})` : ''}`;
            }).join('\n\n');

            return interaction.reply({ content: `**📺 Monitored Channels:**\n\n${list}`, ephemeral: true });
        }
    }
};
