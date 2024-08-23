const mongoose = require('mongoose');
require('dotenv').config(); // Ensure .env variables are loaded

// Connection URL from environment variables
const url = process.env.MONGO_URL; // Ensure MONGO_URL is defined in your .env file

// Function to connect to MongoDB
async function connectToMongoDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(url);
        console.log('Connected successfully to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit the process if connection fails
    }
}

// Export the connect function
module.exports = connectToMongoDB;
