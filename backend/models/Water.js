const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    ph: {
        type: Number,
        required: true
    },
    turbidity: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    dissolvedOxygen: {
        type: Number,
        required: true
    },
    hospitalCases: {
        type: Number,
        default: 0
    },
    outbreakProbability: {
        type: Number,
        default: 0
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Moderate', 'High'],
        default: 'Low'
    }
}, { timestamps: true });

// Index for geo-location queries (optional but good practice)
waterSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Water', waterSchema);
