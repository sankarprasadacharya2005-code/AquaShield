const Water = require('../models/Water');
const Alert = require('../models/Alert');
const { calculateRisk } = require('../utils/riskEngine');

// @desc    Add water quality data
// @route   POST /api/water
// @access  Private (Admin)
const addWaterData = async (req, res) => {
    try {
        const risk = calculateRisk(req.body);
        const waterData = await Water.create({
            ...req.body,
            ...risk,
            outbreakProbability: risk.finalRiskScore
        });

        // Auto-generate alert if risk is High
        if (risk.riskLevel === 'high') {
            await Alert.create({
                title: `High Risk in ${req.body.city}`,
                message: risk.alertMessage,
                severity: 'high',
                city: req.body.city,
                district: req.body.district
            });
        }

        res.status(201).json(waterData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all water data
// @route   GET /api/water
// @access  Public
const getAllWaterData = async (req, res) => {
    try {
        const data = await Water.find().sort({ createdAt: -1 });
        
        const enriched = data.map(station => {
            const risk = calculateRisk(station);
            if (!req.admin) {
                // Public view
                return {
                    city: station.city,
                    temperature: station.temp,
                    finalRiskScore: risk.finalRiskScore,
                    riskLevel: risk.riskLevel,
                    alertMessage: risk.alertMessage,
                    recommendedAction: risk.recommendedAction,
                    createdAt: station.createdAt
                };
            }
            return { ...station.toObject(), ...risk };
        });

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get water data by city
// @route   GET /api/water/location/:city
// @access  Public
const getDataByCity = async (req, res) => {
    try {
        let query = Water.find({ city: new RegExp(req.params.city, 'i') });

        if (!req.admin) {
            query = query.select('city latitude longitude temperature riskLevel outbreakProbability createdAt');
        }

        const data = await query;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get nearest monitoring station data
// @route   POST /api/location
// @access  Public
const getNearestStation = async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const allStations = await Water.find();
        let nearest = null;
        let minDistance = Infinity;

        allStations.forEach(station => {
            const distance = Math.sqrt(Math.pow(station.latitude - latitude, 2) + Math.pow(station.longitude - longitude, 2));
            if (distance < minDistance) {
                minDistance = distance;
                nearest = station;
            }
        });

        if (!nearest) return res.status(404).json({ message: 'No stations found' });

        const risk = calculateRisk(nearest);
        
        if (!req.admin) {
            return res.json({
                temperature: nearest.temp,
                finalRiskScore: risk.finalRiskScore,
                riskLevel: risk.riskLevel,
                alertMessage: risk.alertMessage,
                recommendedAction: risk.recommendedAction
            });
        }

        res.json({ ...nearest.toObject(), ...risk });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addWaterData, getAllWaterData, getDataByCity, getNearestStation };
