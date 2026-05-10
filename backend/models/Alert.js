const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    riskLevel: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
