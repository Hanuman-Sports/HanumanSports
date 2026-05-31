const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, phone } = req.body;
        const userId = req.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (phone !== undefined) user.phone = phone;

        await user.save();
        res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare current password using bcrypt
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password incorrect' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};