const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, msg: 'Email is required' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, msg: 'No account found with this email' });

        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await PasswordReset.create({ email, code, expiresAt });

        // In production, send via email service — never log to console in production
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] Password reset code for ${email}: ${code}`);
        }

        res.json({ success: true, msg: 'Reset code sent to your email' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ success: false, msg: 'Email, code, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, msg: 'Password must be at least 6 characters' });
        }

        const reset = await PasswordReset.findOne({
            where: {
                email,
                code,
                used: 0,
                expiresAt: { [Op.gte]: new Date() }
            }
        });

        if (!reset) return res.status(400).json({ success: false, msg: 'Invalid or expired reset code' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { email } });
        await PasswordReset.update({ used: 1 }, { where: { id: reset.id } });

        res.json({ success: true, msg: 'Password reset successfully' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

module.exports = router;
