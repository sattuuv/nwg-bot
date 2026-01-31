const Parser = require('rss-parser');
const parser = new Parser();
const Streamer = require('../models/Streamer');
const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

// Poll every 5 minutes
const POLL_INTERVAL = 5 * 60 * 1000;

async function checkStreams(client) {
    // console.log(chalk.gray('[POLLER] Checking YouTube feeds...'));

    // Get all unique streamers to avoid fetching same RSS multiple times? 
    // For simplicity, iterate DB. In scale, we'd group ID.
    const streamers = await Streamer.find({});

    for (const data of streamers) {
        if (!data.channelId) continue;

        try {
            const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${data.channelId}`;
            const feed = await parser.parseURL(feedUrl);

            // Get latest entry
            const latest = feed.items[0];
            if (!latest) continue;

            // Check if new
            if (latest.id !== data.lastContentId && data.lastContentId !== 'init') {
                // NEW CONTENT!

                // Fetch Guild & Channel
                const guild = client.guilds.cache.get(data.guildId);
                if (!guild) continue;

                const channel = guild.channels.cache.get(data.notificationChannelId);
                if (!channel) continue;

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
                // First run, just save the current ID so we don't spam old videos
                data.lastContentId = latest.id;
                await data.save();
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
