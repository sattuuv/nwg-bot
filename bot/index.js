require('dotenv').config();
const { BotClient } = require('./src/structures/Client');
const { connectDB } = require('./src/utils/connectDB');

const client = new BotClient();

(async () => {
    // Connect to Database
    await connectDB();

    // Start the Bot
    await client.connect();
})();
