const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
const Streamer = require('../../models/Streamer');
const axios = require('axios');

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
                { name: 'game_role', description: 'Game Role to ping (e.g. @Valorant)', type: 8, required: false },
                {
                    name: 'type',
                    description: 'Notification Type (Default: All)',
                    type: 3,
                    required: false,
                    choices: [
                        { name: 'All Videos (Uploads + Live)', value: 'all' },
                        { name: 'Live Streams Only', value: 'live' }
                    ]
                }
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
            const notifyType = interaction.options.getString('type') || 'all';

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
                notifyType: notifyType,
                lastContentId: 'init' // Start fresh
            });

            return interaction.editReply({ content: `✅ **Added!** Monitoring **${channelName}** (<${url}>) for **${notifyType.toUpperCase()}** content.\nNotifications will go to ${targetChannel}.` });
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
            try {
                const streamers = await Streamer.find({ guildId: interaction.guild.id });
                if (streamers.length === 0) return interaction.reply({ content: 'No streamers monitored.', ephemeral: true });

                // 1. Create Dropdown Options
                const options = streamers.map((s) => ({
                    label: s.channelName ? s.channelName.substring(0, 100) : s.channelId,
                    description: `Channel: <#${s.notificationChannelId}> | Type: ${s.notifyType} (ID: ${s.channelId.substring(0, 10)}...)`,
                    value: s.channelId
                })).slice(0, 25);

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('select_streamer')
                    .setPlaceholder('Select a streamer to manage...')
                    .addOptions(options);

                const row = new ActionRowBuilder().addComponents(selectMenu);

                const embed = new EmbedBuilder()
                    .setTitle('📺 Streamer Dashboard')
                    .setDescription('Select a streamer from the dropdown below to **Edit** or **Remove** them.')
                    .setColor('#2b2d31')
                    .addFields(
                        streamers.map(s => {
                            const role1 = s.roleIdToPing ? `<@&${s.roleIdToPing}>` : '';
                            const role2 = s.gameRoleId ? `<@&${s.gameRoleId}>` : '';
                            const pings = [role1, role2].filter(Boolean).join(' ');
                            return {
                                name: s.channelName || 'Unknown',
                                value: `🔗 <${s.channelLink}>\n📢 <#${s.notificationChannelId}>\n**Type:** ${s.notifyType.toUpperCase()}\n${pings}`,
                                inline: true
                            };
                        }).slice(0, 25)
                    );

                // Defer first to ensure we can fetch it reliably
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const msg = await interaction.editReply({
                    embeds: [embed],
                    components: [row]
                });

                // 2. Collector for Interaction
                const collector = msg.createMessageComponentCollector({ time: 60000 });

                collector.on('collect', async i => {
                    // Safety check: only the command runner can use it
                    if (i.user.id !== interaction.user.id) {
                        return i.reply({ content: '❌ You cannot control this menu.', flags: MessageFlags.Ephemeral });
                    }

                    if (i.customId === 'select_streamer') {
                        const selectedId = i.values[0];
                        const streamerData = streamers.find(s => s.channelId === selectedId);

                        // Safety: Handle if streamer was just deleted
                        if (!streamerData) {
                            return i.update({ content: '❌ Streamer not found (maybe deleted?).', components: [], embeds: [] });
                        }

                        const actionRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId(`delete_${selectedId}`).setLabel('Remove').setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId(`cancel`).setLabel('Cancel').setStyle(ButtonStyle.Secondary)
                        );

                        await i.update({
                            content: `**Manage: ${streamerData.channelName}**\nWhat would you like to do?`,
                            components: [actionRow],
                            embeds: []
                        });
                    }
                    else if (i.customId.startsWith('delete_')) {
                        const idToDelete = i.customId.replace('delete_', '');
                        const result = await Streamer.deleteOne({ guildId: interaction.guild.id, channelId: idToDelete });

                        if (result.deletedCount > 0) {
                            await i.update({ content: `✅ **Removed** streamer. Run /streamer list again to refresh.`, components: [] });
                        } else {
                            await i.update({ content: `❌ Could not delete (ID: ${idToDelete}). Maybe already removed?`, components: [] });
                        }
                    }
                    else if (i.customId === 'cancel') {
                        await i.update({ content: 'Cancelled.', components: [] });
                    }
                });
            } catch (err) {
                console.error(err);
                if (!interaction.replied) {
                    return interaction.reply({ content: `❌ Error: ${err.message}`, ephemeral: true });
                }
            }
        }
    }
};
