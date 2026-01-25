const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log(chalk.red('[DATABASE] No MONGO_URI provided in .env'));
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log(chalk.green('[DATABASE] Connected to MongoDB via Mongoose'));
    } catch (error) {
        console.error(chalk.red('[DATABASE] Connection Error:'), error);
        process.exit(1);
    }
};

module.exports = { connectDB };
