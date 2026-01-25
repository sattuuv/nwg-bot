const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'reactionrole',
    description: 'Setup Reaction Roles',
    options: [
        {
            name: 'setup',
            description: 'Create a reaction role message',
            type: 1,
            options: [
                { name: 'role', description: 'Role to give', type: 8, required: true }, // ROLE
                { name: 'description', description: 'Message description', type: 3, required: true },
                { name: 'emoji', description: 'Button Emoji', type: 3, required: false }
            ]
        }
    ],

    async run(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: 'Manage Roles permission required.', ephemeral: true });
        }

        const role = interaction.options.getRole('role');
        const desc = interaction.options.getString('description');
        const emoji = interaction.options.getString('emoji') || '✨';

        const embed = new EmbedBuilder()
            .setTitle(`Get the ${role.name} Role!`)
            .setDescription(desc)
            .setColor(role.color || 'Random');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`role_${role.id}`)
                .setLabel(`Get ${role.name}`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(emoji)
        );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        return interaction.reply({ content: 'Reaction Role posted!', ephemeral: true });
    }
};
