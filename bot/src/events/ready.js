const { ActivityType, Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(chalk.green(`[READY] Logged in as ${client.user.tag}`));

        client.user.setPresence({
            activities: [{ name: 'NWG Tournaments', type: ActivityType.Competing }],
            status: 'online',
        });

        // Register Slash Commands
        try {
            const commands = client.commands.map(cmd => ({
                name: cmd.name,
                description: cmd.description,
                options: cmd.options || [],
                type: 1
            }));

            // For production, use application.commands.set(commands)
            // For faster dev, use guild specific
            if (process.env.GUILD_ID) {
                await client.guilds.cache.get(process.env.GUILD_ID)?.commands.set(commands);
                console.log(chalk.yellow('[COMMANDS] Registered to Guild'));
            } else {
                await client.application.commands.set(commands);
                console.log(chalk.yellow('[COMMANDS] Registered Globally'));
            }

        } catch (error) {
            console.error(chalk.red('[COMMANDS] Registration Error:'), error);
        }
    },
};
