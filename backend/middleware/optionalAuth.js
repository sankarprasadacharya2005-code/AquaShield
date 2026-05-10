const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = await Admin.findById(decoded.id).select('-password');
        } catch (error) {
            // Token invalid but we don't block, just don't set req.admin
            console.error('Optional auth token failed');
        }
    }
    next();
};

module.exports = { optionalAuth };
