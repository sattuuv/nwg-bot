const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const { Canvacord } = require('canvacord'); // v5 syntax
const Guild = require('../models/Guild');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // --- 1. Auto-Rename Logic ---
        const prefix = 'NWG x ';
        let newNickname = `${prefix}${member.user.username}`;
        if (newNickname.length > 32) newNickname = newNickname.substring(0, 32);

        try {
            if (member.manageable) {
                await member.setNickname(newNickname);
                console.log(chalk.green(`[AUTO-NAME] Renamed ${member.user.tag}`));
            }
        } catch (error) {
            console.error(chalk.red('[AUTO-NAME] Error:'), error.message);
        }

        // --- 2. Fetch Config ---
        const guildData = await Guild.findOne({ guildId: member.guild.id });
        if (!guildData) return;

        // --- 3. Auto-Role Logic ---
        if (guildData.autoRoleId && member.manageable) {
            const role = member.guild.roles.cache.get(guildData.autoRoleId);
            if (role) {
                await member.roles.add(role).catch(e => console.error('Auto-role error:', e));
                console.log(chalk.green(`[AUTO-ROLE] Assigned ${role.name}`));
            }
        }

        // --- 4. Welcome Module ---
        const welcomeConfig = guildData.modules?.welcome;
        if (welcomeConfig?.enabled && welcomeConfig.channelId) {
            const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
            if (!channel) return;

            // Prepare Message
            let messageContent = welcomeConfig.message || "Welcome {user} to {guild}!";
            messageContent = messageContent
                .replace(/{user}/g, member.toString())
                .replace(/{guild}/g, member.guild.name)
                .replace(/{count}/g, member.guild.memberCount);

            const payload = { content: messageContent, files: [] };

            // Generate Card
            if (welcomeConfig.cardEnabled) {
                try {
                    // Create Welcomer Card (Canvacord v5)
                    // Note: If using v6, syntax might differ. v5 is safer for now.
                    // Actually, canvacord syntax is cleaner in newer versions but let's stick to standard `canvacord.Welcomer` if possible or check docs.
                    // For safety, I'll use specific v5 syntax or specific imports if needed.
                    // Assuming 'canvacord' package exports a Welcomer class or similar builder.
                    // Wait, `const { Canvacord } = require('canvacord');` might be wrong for library 'canvacord'.
                    // Usually it's `const canvacord = require('canvacord'); const card = new canvacord.Welcomer()...`

                    const canvacord = require('canvacord');

                    const card = new canvacord.Welcomer()
                        .setUsername(member.user.username)
                        .setDiscriminator(member.user.discriminator || '0000') // Discord updated usernames
                        .setMemberCount(member.guild.memberCount)
                        .setGuildName(member.guild.name)
                        .setAvatar(member.user.displayAvatarURL({ extension: 'png' }))
                        .setColor("title", "#F81C4F")
                        .setColor("username-box", "#F81C4F")
                        .setColor("discriminator-box", "#F81C4F")
                        .setColor("message-box", "#F81C4F")
                        .setColor("border", "#F81C4F")
                        .setColor("avatar", "#F81C4F")
                        .setBackground("https://i.imgur.com/8QZ7j9B.png") // Default cool background or transparent
                        .setText("title", "WELCOME")
                        .setText("message", "to {server}");

                    card.build().then(buffer => {
                        const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });
                        payload.files = [attachment];
                        channel.send(payload);
                    });

                } catch (err) {
                    console.error('Welcome Card Error:', err);
                    channel.send(payload); // Send without image if failed
                }
            } else {
                channel.send(payload);
            }
        }
    },
};
