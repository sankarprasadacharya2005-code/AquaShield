const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Water = require('./models/Water');
const Alert = require('./models/Alert');
const Feedback = require('./models/Feedback');
const { calculateRisk } = require('./utils/riskCalculator');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME });

        // Clear existing data
        await Admin.deleteMany();
        await Water.deleteMany();
        await Alert.deleteMany();
        await Feedback.deleteMany();

        console.log('Data cleared...');

        // 1. Create Admin
        await Admin.create({
            username: 'sankar',
            password: '1234'
        });
        console.log('Admin created: sankar / 1234');

        // 2. Create Water Data
        const sampleWater = [
            { city: 'New York', latitude: 40.7128, longitude: -74.0060, ph: 7.2, turbidity: 2.1, temperature: 18, dissolvedOxygen: 7.5, hospitalCases: 12 },
            { city: 'Mumbai', latitude: 19.0760, longitude: 72.8777, ph: 6.1, turbidity: 12.5, temperature: 32, dissolvedOxygen: 4.2, hospitalCases: 85 },
            { city: 'London', latitude: 51.5074, longitude: -0.1278, ph: 7.8, turbidity: 1.5, temperature: 14, dissolvedOxygen: 8.1, hospitalCases: 5 },
            { city: 'Dhaka', latitude: 23.8103, longitude: 90.4125, ph: 5.2, turbidity: 25.0, temperature: 34, dissolvedOxygen: 2.5, hospitalCases: 140 }
        ];

        for (const item of sampleWater) {
            const { outbreakProbability, riskLevel } = calculateRisk(item.ph, item.turbidity, item.temperature, item.dissolvedOxygen);
            
            const water = await Water.create({
                ...item,
                outbreakProbability,
                riskLevel
            });

            if (riskLevel === 'High') {
                await Alert.create({
                    city: item.city,
                    message: `URGENT: High waterborne disease risk detected in ${item.city}. Quality parameters exceed safe limits.`,
                    riskLevel
                });
            }
        }
        console.log('Water data and alerts seeded...');

        // 3. Create Feedback
        await Feedback.create({
            name: 'John Doe',
            email: 'john@example.com',
            area: 'Brooklyn',
            description: 'The water in our area seems a bit cloudy today.',
            imageURL: 'https://example.com/water_sample.jpg'
        });

        // 4. Create Hospital Data
        const HospitalData = require('./models/HospitalData');
        await HospitalData.deleteMany();
        await HospitalData.create([
            { hospitalName: 'AIIMS Bhubaneswar', district: 'Khordha', city: 'Bhubaneswar', village: 'Patrapada', area: 'Patrapada, Bhubaneswar', date: '2026-05-09', diseaseType: 'Cholera', cases: 10 },
            { hospitalName: 'AIIMS Bhubaneswar', district: 'Khordha', city: 'Bhubaneswar', village: 'Patrapada', area: 'Patrapada, Bhubaneswar', date: '2026-05-10', diseaseType: 'Cholera', cases: 18 }
        ]);

        console.log('Feedback and Hospital data seeded...');

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
