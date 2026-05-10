const express = require('express');
const { addWaterData, getAllWaterData, getDataByCity, getNearestStation } = require('../controllers/waterController');
const { optionalAuth } = require('../middleware/optionalAuth');
const router = express.Router();

router.post('/', addWaterData);
router.get('/', optionalAuth, getAllWaterData);
router.get('/location/:city', optionalAuth, getDataByCity);
router.post('/nearest', optionalAuth, getNearestStation);
router.post('/location', optionalAuth, getNearestStation); // Alias for user request

module.exports = router;
