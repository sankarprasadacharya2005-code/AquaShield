const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

router.post('/data', hospitalController.addHospitalData);
router.get('/data', hospitalController.getHospitalData);
router.get('/stats/:area', hospitalController.getHospitalStats);

module.exports = router;
