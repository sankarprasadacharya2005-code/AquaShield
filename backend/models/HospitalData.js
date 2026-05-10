const mongoose = require('mongoose');

const hospitalDataSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    village: {
        type: String,
        trim: true
    },
    area: {
        type: String,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    diseaseType: {
        type: String,
        required: true,
        enum: ['Typhoid', 'Cholera', 'Diarrhea', 'Other']
    },
    cases: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('HospitalData', hospitalDataSchema);
