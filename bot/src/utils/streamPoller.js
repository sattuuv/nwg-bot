const Parser = require('rss-parser');
const parser = new Parser();
const Streamer = require('../models/Streamer');
const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

// Poll every 5 minutes
const POLL_INTERVAL = 5 * 60 * 1000;

async function checkStreams(client) {
    console.log(chalk.gray('[POLLER] Starting check...'));

    // Get all unique streamers to avoid fetching same RSS multiple times? 
    // For simplicity, iterate DB. In scale, we'd group ID.
    const streamers = await Streamer.find({});
    console.log(chalk.gray(`[POLLER] Found ${streamers.length} streamers to check.`));

    for (const data of streamers) {
        if (!data.channelId) continue;

        try {
            const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${data.channelId}`;
            // console.log(`[POLLER] Fetching ${feedUrl}`);
            const feed = await parser.parseURL(feedUrl);

            // Get latest entry
            const latest = feed.items[0];
            if (!latest) {
                console.log(chalk.yellow(`[POLLER] No videos found for ${data.channelId}`));
                continue;
            }

            console.log(chalk.gray(`[POLLER] ${data.channelId}: Latest video is "${latest.title}" (${latest.id})`));

            // Check if new
            if (latest.id !== data.lastContentId && data.lastContentId !== 'init') {
                console.log(chalk.green(`[POLLER] NEW CONTENT DETECTED: ${latest.title}`));
                // NEW CONTENT!

                // Fetch Guild & Channel
                const guild = client.guilds.cache.get(data.guildId);
                if (!guild) {
                    console.log('[POLLER] Guild not found');
                    continue;
                }

                const channel = guild.channels.cache.get(data.notificationChannelId);
                if (!channel) {
                    console.log('[POLLER] Notification channel not found');
                    continue;
                }

                const rolePing = data.roleIdToPing ? `<@&${data.roleIdToPing}>` : '';

                const embed = new EmbedBuilder()
                    .setTitle(`🔴 New Video/Stream: ${latest.title}`)
                    .setURL(latest.link)
                    .setAuthor({ name: latest.author })
                    .setImage(`https://img.youtube.com/vi/${latest.id.replace('yt:video:', '')}/maxresdefault.jpg`) // Construct thumb
                    .setColor('#FF0000')
                    .setTimestamp(new Date(latest.pubDate));

                await channel.send({ content: `${rolePing} **${latest.author}** just posted!`, embeds: [embed] });

                console.log(chalk.magenta(`[YOUTUBE] Notification sent for ${latest.author} in ${guild.name}`));

                // Update DB
                data.lastContentId = latest.id;
                data.lastCheckTime = Date.now();
                await data.save();

            } else if (data.lastContentId === 'init') {
                console.log(chalk.blue(`[POLLER] Initialized ${data.channelId} with last video: ${latest.title}`));
                // First run, just save the current ID so we don't spam old videos
                data.lastContentId = latest.id;
                await data.save();
            } else {
                // No new content
                // console.log(`[POLLER] No new content for ${data.channelId}`);
            }

        } catch (err) {
            console.error(`[POLLER] Error checking ${data.channelId}:`, err.message);
        }
    }
}

module.exports = (client) => {
    // Initial check
    checkStreams(client);

    // Interval
    setInterval(() => checkStreams(client), POLL_INTERVAL);
};
