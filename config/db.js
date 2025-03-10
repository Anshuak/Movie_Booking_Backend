// db.js
const mongoose = require('mongoose');

// Connection URL from environment variables
const url = process.env.MONGO_URL;  // MONGO_URL is loaded from .env

// Function to connect to MongoDB
async function connectToMongoDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(url);
        console.log('Connected successfully to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);  // Exit the process if connection fails
    }
}

// Export the connect function
module.exports = connectToMongoDB;
