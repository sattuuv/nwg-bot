const { Events, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

// Cache to prevent duplicate notifications (User ID -> Timestamp)
const liveCache = new Map();
const COOLDOWN = 60 * 60 * 1000; // 1 Hour cooldown per streamer notification

module.exports = {
    name: Events.PresenceUpdate,
    async execute(oldPresence, newPresence, client) {
        if (!newPresence || !newPresence.user) return;

        const isStreaming = newPresence.activities.find(act => act.type === 1); // 1 = Streaming
        const wasStreaming = oldPresence?.activities?.find(act => act.type === 1);

        if (isStreaming && !wasStreaming) {
            // User just went live
            const userId = newPresence.user.id;
            const now = Date.now();

            if (liveCache.has(userId) && (now - liveCache.get(userId)) < COOLDOWN) {
                return; // Cooldown active
            }

            liveCache.set(userId, now);

            // Fetch the notification channel (In prod, fetch from DB settings)
            // For now, try to find a channel named 'live-streams' or similar, or prompt user to configure one.
            // fallback to system channel or first text channel

            const guild = newPresence.guild;
            if (!guild) return;

            // Simple Logic: Look for channel named 'streams' or 'live'
            const channel = guild.channels.cache.find(c => c.name.includes('stream') && c.isTextBased())
                || guild.channels.cache.find(c => c.name.includes('live') && c.isTextBased())
                || guild.publicUpdatesChannel;

            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle(`🎥 ${newPresence.user.username} is NOW LIVE!`)
                    .setDescription(`**${isStreaming.details || 'Playing a Game'}**\n\n${isStreaming.state || 'Join the fun!'}`)
                    .setURL(isStreaming.url)
                    .setColor('#9146FF') // Twitch Purple
                    .setThumbnail(newPresence.user.displayAvatarURL())
                    .addFields({ name: 'Watch Now', value: `[Click Here](${isStreaming.url})` })
                    .setTimestamp();

                channel.send({ content: `@everyone ${newPresence.user.username} is live!`, embeds: [embed] }).catch(console.error);
                console.log(chalk.magenta(`[STREAM] Announced ${newPresence.user.username} in ${guild.name}`));
            }
        }
    }
};
