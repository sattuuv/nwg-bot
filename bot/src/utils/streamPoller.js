const Parser = require('rss-parser');
const parser = new Parser();
const Streamer = require('../models/Streamer');
const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

// Poll every 5 minutes
const POLL_INTERVAL = 5 * 60 * 1000;

const axios = require('axios'); // Ensure axios is required

// Helper to check if a video is actually live
async function isLive(videoId) {
    try {
        const res = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        return res.data.includes('isLive":true');
    } catch (e) {
        console.error('Error checking live status:', e.message);
        return false;
    }
}

async function checkStreams(client) {
    console.log(chalk.gray('[POLLER] Starting check...'));

    const streamers = await Streamer.find({});
    console.log(chalk.gray(`[POLLER] Found ${streamers.length} streamers to check.`));

    for (const data of streamers) {
        if (!data.channelId) continue;

        try {
            const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${data.channelId}`;
            const feed = await parser.parseURL(feedUrl);

            const latest = feed.items[0];
            if (!latest) continue;

            // Check if new
            if (latest.id !== data.lastContentId && data.lastContentId !== 'init') {
                const videoId = latest.id.replace('yt:video:', '');

                // LIVE ONLY CHECK
                if (data.notifyType === 'live') {
                    const liveStatus = await isLive(videoId);
                    if (!liveStatus) {
                        console.log(chalk.yellow(`[POLLER] Skipping upload for ${data.channelName} (Live Only mode)`));
                        data.lastContentId = latest.id;
                        await data.save();
                        continue;
                    }
                }

                console.log(chalk.green(`[POLLER] NEW CONTENT DETECTED: ${latest.title}`));

                // Fetch Guild & Channel
                const guild = client.guilds.cache.get(data.guildId);
                if (!guild) continue;

                const channel = guild.channels.cache.get(data.notificationChannelId);
                if (!channel) continue;

                const rolePing1 = data.roleIdToPing ? `<@&${data.roleIdToPing}>` : '';
                const rolePing2 = data.gameRoleId ? `<@&${data.gameRoleId}>` : '';
                const pings = [rolePing1, rolePing2].filter(Boolean).join(' ');

                const embed = new EmbedBuilder()
                    .setTitle(`🔴 ${data.notifyType === 'live' ? 'Live Stream' : 'New Video'}: ${latest.title}`)
                    .setURL(latest.link)
                    .setAuthor({ name: latest.author })
                    .setImage(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
                    .setColor('#FF0000')
                    .setTimestamp(new Date(latest.pubDate));

                const msgContent = pings
                    ? `Hey fellas! **${latest.author}** is live! ${pings}`
                    : `Hey fellas! **${latest.author}** is live!`;

                await channel.send({ content: msgContent, embeds: [embed] });

                console.log(chalk.magenta(`[YOUTUBE] Notification sent for ${latest.author}`));

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
