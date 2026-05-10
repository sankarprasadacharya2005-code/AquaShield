const Feedback = require('../models/Feedback');

// @desc    Store user feedback
// @route   POST /api/feedback
// @access  Public
const addFeedback = async (req, res) => {
    const { name, email, area, description, imageURL } = req.body;

    try {
        const feedback = await Feedback.create({
            name,
            email,
            area,
            description,
            imageURL
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin view all feedback
// @route   GET /api/feedback
// @access  Private (Admin Only)
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addFeedback, getAllFeedback };
