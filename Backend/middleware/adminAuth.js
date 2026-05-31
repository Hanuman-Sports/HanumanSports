const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the user role is 'admin'
        if (decodedToken.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }
        
        req.userData = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};