const User = require('../models/User');

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

        // Compare current password (assuming plain text for now)
        if (user.password !== currentPassword) {
            return res.status(400).json({ message: 'Current password incorrect' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};