const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Connecting to:', process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
        process.exit(1);
    });
