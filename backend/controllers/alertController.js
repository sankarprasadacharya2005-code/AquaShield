const Alert = require('../models/Alert');

// @desc    Get all high risk alerts
// @route   GET /api/alerts
// @access  Public
const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllAlerts };
