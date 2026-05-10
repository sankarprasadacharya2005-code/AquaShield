const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/water', require('./routes/waterRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/hospital', require('./routes/hospitalRoutes'));

app.post('/api/reverse-geocode', async (req, res) => {
    try {
        const { lat, lon } = req.body;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        const area = data.address.village || data.address.suburb || data.address.city || 'Unknown Area';
        res.json({ area });
    } catch (error) {
        res.status(500).json({ error: 'Geocoding failed' });
    }
});

// Basic error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
