const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'reactionrole',
    description: 'Setup Reaction Roles',
    options: [
        {
            name: 'create',
            description: 'Create a multi-role reaction message',
            type: 1,
            options: [
                { name: 'title', description: 'Embed Title', type: 3, required: true },
                { name: 'description', description: 'Embed Description', type: 3, required: true },
                // Role 1
                { name: 'role1', description: 'Role 1', type: 8, required: true },
                { name: 'emoji1', description: 'Emoji 1', type: 3, required: true },
                { name: 'label1', description: 'Button Label 1', type: 3, required: false },
                // Role 2
                { name: 'role2', description: 'Role 2', type: 8, required: false },
                { name: 'emoji2', description: 'Emoji 2', type: 3, required: false },
                { name: 'label2', description: 'Button Label 2', type: 3, required: false },
                // Role 3
                { name: 'role3', description: 'Role 3', type: 8, required: false },
                { name: 'emoji3', description: 'Emoji 3', type: 3, required: false },
                { name: 'label3', description: 'Button Label 3', type: 3, required: false },
                // Role 4
                { name: 'role4', description: 'Role 4', type: 8, required: false },
                { name: 'emoji4', description: 'Emoji 4', type: 3, required: false },
                { name: 'label4', description: 'Button Label 4', type: 3, required: false },
                // Role 5
                { name: 'role5', description: 'Role 5', type: 8, required: false },
                { name: 'emoji5', description: 'Emoji 5', type: 3, required: false },
                { name: 'label5', description: 'Button Label 5', type: 3, required: false },
            ]
        }
    ],

    async run(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: 'Manage Roles permission required.', ephemeral: true });
        }

        const title = interaction.options.getString('title');
        const desc = interaction.options.getString('description');

        const roles = [];
        for (let i = 1; i <= 5; i++) {
            const role = interaction.options.getRole(`role${i}`);
            if (role) {
                roles.push({
                    role: role,
                    emoji: interaction.options.getString(`emoji${i}`),
                    label: interaction.options.getString(`label${i}`) || role.name
                });
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(desc)
            .setColor('Blurple'); // Neutral color

        const rows = [];
        let currentRow = new ActionRowBuilder();

        roles.forEach((r, index) => {
            // Append info to description
            embed.addFields({ name: `${r.emoji} ${r.label}`, value: `<@&${r.role.id}>`, inline: true });

            const btn = new ButtonBuilder()
                .setCustomId(`role_${r.role.id}`)
                .setLabel(r.label)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(r.emoji);

            currentRow.addComponents(btn);

            if (currentRow.components.length >= 5 || index === roles.length - 1) {
                rows.push(currentRow);
                currentRow = new ActionRowBuilder();
            }
        });

        await interaction.channel.send({ embeds: [embed], components: rows });
        return interaction.reply({ content: '✅ Multi-Role Menu posted!', ephemeral: true });
    }
};
