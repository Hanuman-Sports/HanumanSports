const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body;

        if (!email || !password || !firstname) {
            return res.status(400).json({ message: 'First name, email, and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ firstname, lastname: lastname || '', email, password: hashedPassword, phone: phone || null });
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, firstname: user.firstname, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, phone } = req.body;
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (firstname !== undefined) user.firstname = firstname;
        if (lastname !== undefined) user.lastname = lastname;
        if (phone !== undefined) user.phone = phone;
        if (req.file) user.profileImg = req.file.filename;
        await user.save();
        res.status(200).json({ success: true, message: "Profile updated successfully", user: { id: user.id, firstname: user.firstname, lastname: user.lastname, phone: user.phone, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, message: "Profile update failed" });
    }
};