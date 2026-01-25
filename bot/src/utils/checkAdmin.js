const { PermissionFlagsBits } = require('discord.js');

module.exports = (interaction) => {
    // 1. Check for Discord Administrator Permission (Always valid)
    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return true;

    // 2. Check for Bot Owner (from .env)
    if (process.env.OWNER_ID && interaction.user.id === process.env.OWNER_ID) return true;

    // 3. Check for Custom Admin Role (from .env)
    if (process.env.ADMIN_ROLE_ID) {
        if (interaction.member.roles.cache.has(process.env.ADMIN_ROLE_ID)) return true;
    }

    return false;
};
