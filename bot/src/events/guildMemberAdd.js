const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Define the prefix
        const prefix = 'NWG x ';

        // Construct new nickname (limit to 32 chars as per Discord limits)
        let newNickname = `${prefix}${member.user.username}`;
        if (newNickname.length > 32) {
            newNickname = newNickname.substring(0, 32);
        }

        try {
            // Check if bot can manage this user
            if (member.manageable) {
                await member.setNickname(newNickname);
                console.log(chalk.green(`[AUTO-NAME] Renamed ${member.user.tag} to ${newNickname}`));
            } else {
                console.log(chalk.yellow(`[AUTO-NAME] Cannot rename ${member.user.tag} (Role hierarchy or Owner).`));
            }
        } catch (error) {
            console.error(chalk.red('[AUTO-NAME] Error renaming member:'), error);
        }

        // Optional: Send welcome message (Can be expanded later)
        // const welcomeChannel = member.guild.channels.cache.find(ch => ch.name.includes('welcome'));
        // if (welcomeChannel) welcomeChannel.send(`Welcome to NWG, ${member}!`);
    },
};
