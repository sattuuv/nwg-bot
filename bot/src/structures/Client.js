const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);
const path = require('path');
const chalk = require('chalk');

class BotClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.DirectMessages
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
            allowedMentions: { parse: ['users', 'roles'], repliedUser: false }
        });

        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.config = process.env;
    }

    async connect() {
        await this.registerModules();
        await this.login(this.config.DISCORD_TOKEN);

        // Start Poller
        try {
            require('./utils/streamPoller')(this);
            console.log(chalk.green('[SYSTEM] Stream Poller Started'));
        } catch (e) {
            console.error('[SYSTEM] Failed to start poller:', e);
        }
    }

    async registerModules() {
        // Load Commands
        const commandFiles = await globPromise(`${process.cwd().replace(/\\/g, '/')}/src/commands/**/*.js`);
        commandFiles.forEach((file) => {
            const command = require(file);
            if (!command.name) return;
            this.commands.set(command.name, command);
            console.log(chalk.green(`[COMMAND] Loaded: ${command.name}`));
        });

        // Load Events
        const eventFiles = await globPromise(`${process.cwd().replace(/\\/g, '/')}/src/events/*.js`);
        eventFiles.forEach((file) => {
            const event = require(file);
            console.log(chalk.blue(`[EVENT] Loaded: ${event.name}`));
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args, this));
            } else {
                this.on(event.name, (...args) => event.execute(...args, this));
            }
        });
    }
}

module.exports = { BotClient };
