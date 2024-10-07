const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to req.user
        next();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
