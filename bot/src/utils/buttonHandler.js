const { EmbedBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Post = require('../models/Post');

module.exports = async (client, interaction) => {
    const customId = interaction.customId;

    // --- TICKET SYSTEM ---
    if (customId.startsWith('ticket_')) {
        const type = customId.split('_')[1];

        if (type === 'close') {
            await interaction.reply({ content: 'Deleting ticket in 5 seconds...' });
            setTimeout(() => interaction.channel.delete().catch(() => { }), 5000);
            return;
        }

        // Logic for creating tickets
        const guild = interaction.guild;
        const categoryName = 'Tickets';
        // In a real bot, we'd check for existing category or create one
        let category = guild.channels.cache.find(c => c.name === categoryName && c.type === ChannelType.GuildCategory);

        if (!category) {
            try {
                category = await guild.channels.create({
                    name: categoryName,
                    type: ChannelType.GuildCategory
                });
            } catch (err) {
                // Ignore permissions error for now or log it
                console.error(err);
            }
        }

        const channelName = `${type}-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9]/g, '');

        // precise permission logic
        const channel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category ? category.id : null,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles]
                },
                {
                    id: client.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels]
                }
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle(`${type.toUpperCase()} Ticket`)
            .setDescription(`Hello ${interaction.user}, support will be with you shortly.\nClick below to close this ticket.`)
            .setColor('Green');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
        );

        await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
        return interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
    }

    // --- ESPORTS: LFP / LFT / SCRIMS ---

    // DM HOST
    if (customId === 'dm_host') {
        // Try to fetch from DB first (for LFP/LFT)
        const post = await Post.findOne({ messageId: interaction.message.id });
        let hostId = null;

        if (post) {
            hostId = post.creatorId;
        } else {
            // Fallback for Scrims (parse from description if possible, but for now just tell them to look at the embed)
            // The Scrim embed usually mentions the host in the description or footer.
            // A simple "Not found" or generic message is safer if we can't be sure.
            // BUT, for the scrim command I wrote earlier, the host is in the embed description: "Host: <@id>".
            // Parsing that is brittle. Let's just say:
            return interaction.reply({ content: 'Please right-click the host mentioned in the post to DM them directly.', ephemeral: true });
        }

        return interaction.reply({ content: `You can DM the host here: <@${hostId}>`, ephemeral: true });
    }

    // CLAIM LOGIC (LFP / LFT / SCRIMS)
    if (customId === 'lfp_claim' || customId === 'lft_claim' || customId === 'claim_slot') {
        const post = await Post.findOne({ messageId: interaction.message.id });

        if (!post) {
            return interaction.reply({ content: '❌ This post is no longer active or wasn\'t tracked.', ephemeral: true });
        }

        if (post.creatorId === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot claim your own post.', ephemeral: true });
        }

        if (post.claimIds.includes(interaction.user.id)) {
            return interaction.reply({ content: '⚠ You have already claimed this.', ephemeral: true });
        }

        // Add user
        post.claimIds.push(interaction.user.id);
        await post.save();

        // Notify User
        await interaction.reply({ content: `✅ Successfully claimed! You can now DM <@${post.creatorId}> to connect.`, ephemeral: true });

        // Update Embed ?
        const maxClaims = post.maxClaims || 3;

        // The user wanted: "3 claims -> delete message"
        if (post.claimIds.length >= maxClaims) {
            await interaction.message.delete().catch(() => { });
            await Post.deleteOne({ _id: post._id });
            if (interaction.channel) {
                interaction.channel.send({ content: `🔒 A post by <@${post.creatorId}> has been filled and removed.` }).then(msg => setTimeout(() => msg.delete(), 5000));
            }
        } else {
            // Update the "Slots Filled" field if possible
            const oldEmbed = interaction.message.embeds[0];
            if (oldEmbed) {
                const newEmbed = new EmbedBuilder(oldEmbed.toJSON());
                // Find "Slots Filled" field
                const fieldIdx = newEmbed.data.fields.findIndex(f => f.name === 'Slots Filled') || newEmbed.data.fields.findIndex(f => f.name === 'Slots');
                if (fieldIdx !== -1) {
                    newEmbed.data.fields[fieldIdx].value = `${post.claimIds.length}/${maxClaims}`;
                    await interaction.message.edit({ embeds: [newEmbed] });
                } else if (customId === 'claim_slot') {
                    // Scrims might format it differently in description "Slots: X"
                    // Attempt to update description if field not found? 
                    // For now, doing nothing for description is safer than breaking it.
                }
            }
        }
        return;
    }

    // --- REACTION ROLES ---
    if (customId.startsWith('role_')) {
        const roleId = customId.split('_')[1];
        const role = interaction.guild.roles.cache.get(roleId);
        const member = interaction.member;

        if (!role) {
            return interaction.reply({ content: '❌ Role not found.', ephemeral: true });
        }

        if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
            return interaction.reply({ content: `➖ Removed **${role.name}** role.`, ephemeral: true });
        } else {
            await member.roles.add(roleId);
            return interaction.reply({ content: `➕ Added **${role.name}** role.`, ephemeral: true });
        }
    }

    // Fallback
    return interaction.reply({ content: 'Interaction not handled.', ephemeral: true });
};
