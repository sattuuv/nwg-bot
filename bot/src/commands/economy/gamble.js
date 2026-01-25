const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    name: 'gamble',
    description: 'Economy and Betting',
    options: [
        {
            name: 'balance',
            description: 'Check your balance',
            type: 1
        },
        {
            name: 'bet',
            description: 'Bet on a coinflip',
            type: 1,
            options: [
                { name: 'amount', description: 'Amount to bet', type: 4, required: true },
                { name: 'side', description: 'Heads or Tails', type: 3, choices: [{ name: 'Heads', value: 'heads' }, { name: 'Tails', value: 'tails' }], required: true }
            ]
        }
    ],

    async run(client, interaction) {
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        // Ensure user exists
        let user = await User.findOne({ userId });
        if (!user) {
            user = await User.create({ userId, username: interaction.user.username, balance: 100 }); // Starting bonus
        }

        if (sub === 'balance') {
            const embed = new EmbedBuilder()
                .setTitle(`💰 ${interaction.user.username}'s Wallet`)
                .setDescription(`**Balance**: $${user.balance}`)
                .setColor('Gold');
            return interaction.reply({ embeds: [embed] });
        }

        if (sub === 'bet') {
            const amount = interaction.options.getInteger('amount');
            const side = interaction.options.getString('side');

            if (amount > user.balance) return interaction.reply({ content: `You only have $${user.balance}!`, ephemeral: true });
            if (amount < 1) return interaction.reply({ content: "Bet needs to be positive!", ephemeral: true });

            const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
            const win = outcome === side;

            if (win) {
                user.balance += amount;
                await user.save();
                return interaction.reply({ content: `🪙 Result: **${outcome.toUpperCase()}**! You WIN $${amount}! New Balance: $${user.balance}` });
            } else {
                user.balance -= amount;
                await user.save();
                return interaction.reply({ content: `🪙 Result: **${outcome.toUpperCase()}**! You LOST $${amount}. New Balance: $${user.balance}` });
            }
        }
    }
};
