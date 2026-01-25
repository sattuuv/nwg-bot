const { ActivityType, Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(chalk.green(`[READY] Logged in as ${client.user.tag}`));

        // Dynamic Status
        const BotConfig = require('../models/BotConfig');
        const config = await BotConfig.findOne({ instanceId: 'global' });

        const activityName = config ? config.activityName : 'NWG Tournaments';
        const activityType = config ? config.activityType : ActivityType.Competing;
        const status = config ? config.status : 'online';

        client.user.setPresence({
            activities: [{ name: activityName, type: activityType }],
            status: status,
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
