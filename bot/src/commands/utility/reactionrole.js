const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ReactionMessage = require('../../models/ReactionMessage');

module.exports = {
    name: 'reactionrole',
    description: 'Setup Reaction Roles (Native)',
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
                { name: 'emoji1', description: 'Emoji 1 (Type the emoji itself)', type: 3, required: true },
                // Role 2
                { name: 'role2', description: 'Role 2', type: 8, required: false },
                { name: 'emoji2', description: 'Emoji 2', type: 3, required: false },
                // Role 3
                { name: 'role3', description: 'Role 3', type: 8, required: false },
                { name: 'emoji3', description: 'Emoji 3', type: 3, required: false },
                // Role 4
                { name: 'role4', description: 'Role 4', type: 8, required: false },
                { name: 'emoji4', description: 'Emoji 4', type: 3, required: false },
                // Role 5
                { name: 'role5', description: 'Role 5', type: 8, required: false },
                { name: 'emoji5', description: 'Emoji 5', type: 3, required: false },
            ]
        }
    ],

    async run(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: 'Manage Roles permission required.', ephemeral: true });
        }

        const title = interaction.options.getString('title');
        const descInput = interaction.options.getString('description');

        const rolesToSave = [];
        for (let i = 1; i <= 5; i++) {
            const role = interaction.options.getRole(`role${i}`);
            // Note: Emoji inputs might be actual unicode (🔴) or Discord custom ID string
            const emojiInput = interaction.options.getString(`emoji${i}`);

            if (role && emojiInput) {
                rolesToSave.push({
                    role: role,
                    emoji: emojiInput
                });
            }
        }

        // Generate Description
        let finalDescription = descInput ? `${descInput}\n\n` : '';
        rolesToSave.forEach((r, index) => {
            finalDescription += `${index + 1}. React with ${r.emoji} for ${r.role}\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(finalDescription)
            .setColor('Blurple');

        // Send Message (No Inputs yet)
        const sentMessage = await interaction.channel.send({ embeds: [embed] });

        // Save to Database
        try {
            await ReactionMessage.create({
                guildId: interaction.guild.id,
                channelId: interaction.channel.id,
                messageId: sentMessage.id,
                roles: rolesToSave.map(r => ({
                    emoji: r.emoji,   // We store the input string directly
                    roleId: r.role.id
                }))
            });

            // React to the message
            for (const r of rolesToSave) {
                try {
                    await sentMessage.react(r.emoji);
                } catch (e) {
                    console.error(`Failed to react with ${r.emoji}:`, e);
                }
            }

            return interaction.reply({ content: '✅ Native Reaction Role created!', ephemeral: true });

        } catch (err) {
            console.error(err);
            return interaction.reply({ content: '❌ Failed to save to database.', ephemeral: true });
        }
    }
};
