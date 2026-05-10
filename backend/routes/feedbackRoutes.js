const express = require('express');
const { addFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', addFeedback);
router.get('/', protect, getAllFeedback); // Protected admin route

module.exports = router;
