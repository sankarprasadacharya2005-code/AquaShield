const HospitalData = require('../models/HospitalData');

exports.addHospitalData = async (req, res) => {
    try {
        const { hospitalName, district, city, village, date, diseaseType, cases } = req.body;
        
        const area = village ? `${village}, ${city}` : city;
        
        const newData = new HospitalData({
            hospitalName,
            district,
            city,
            village,
            area,
            date,
            diseaseType,
            cases: parseInt(cases)
        });

        await newData.save();
        res.status(201).json({ success: true, data: newData });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getHospitalData = async (req, res) => {
    try {
        const { area } = req.query;
        const query = area ? { area } : {};
        const records = await HospitalData.find(query).sort({ date: -1 });
        res.status(200).json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHospitalStats = async (req, res) => {
    try {
        const { area } = req.params;
        const records = await HospitalData.find({ area }).sort({ date: -1 }).limit(8);
        
        if (records.length < 2) {
            return res.status(200).json({ success: true, stats: null });
        }

        const latest = records[0].cases;
        const prevRecords = records.slice(1);
        const prevAvg = prevRecords.reduce((acc, r) => acc + r.cases, 0) / prevRecords.length;
        
        const growthRate = prevAvg === 0 ? 0 : ((latest - prevAvg) / prevAvg) * 100;
        
        res.status(200).json({ 
            success: true, 
            stats: { latest, prevAvg, growthRate, score: Math.min(100, growthRate * 1.2) } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
