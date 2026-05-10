const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Backend attempting DB connect to:', process.env.MONGO_URL.replace(/:([^@]+)@/, ':****@'));
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.DB_NAME
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Backend DB Error: ${error.message}`);
        // process.exit(1);
    }
};

module.exports = connectDB;
