const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        
        // FIX: Check if email already exists before inserting
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create new user in DB
        const newUser = await User.create({ firstname, lastname, email, password });
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        // Simple validation (In production, use bcrypt to compare hashed passwords)
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Create the token using the .env secret
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { id: user.id, firstname: user.firstname, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    res.status(200).json({ message: "Profile updated successfully" });
};