const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    // Safely extract token whether it has "Bearer " prefix or not
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    if (!token) return res.status(403).send({ message: "No token provided!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized! Redirecting to login." });
        req.userId = decoded.id;
        next();
    });
};