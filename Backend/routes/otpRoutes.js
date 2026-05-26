const express = require('express');
const router = express.Router();
const Otp = require('../models/Otp');

// Generate a random 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/otp/send — Generate and store OTP for a phone number
router.post('/send', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone || phone.length < 10) {
            return res.status(400).json({ success: false, message: 'Valid phone number is required' });
        }

        // Invalidate any previous unverified OTPs for this phone
        await Otp.update({ verified: true }, {
            where: { phone, verified: false }
        });

        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // valid 2 minutes

        await Otp.create({
            phone,
            otp: otpCode,
            expiresAt,
            verified: false
        });

        // Log OTP to console (SMS gateway integration would go here)
        console.log(`[OTP] 📱 OTP for ${phone}: ${otpCode}`);

        const masked = phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');

        res.json({
            success: true,
            message: `OTP sent to ${masked}`,
            masked
        });
    } catch (err) {
        console.error('OTP send error:', err);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// POST /api/otp/verify — Verify OTP for a phone number
router.post('/verify', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
        }

        const otpRecord = await Otp.findOne({
            where: { phone, otp, verified: false },
            order: [['createdAt', 'DESC']]
        });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (new Date() > new Date(otpRecord.expiresAt)) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        await otpRecord.update({ verified: true });

        res.json({ success: true, message: 'Phone verified successfully' });
    } catch (err) {
        console.error('OTP verify error:', err);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
});

module.exports = router;
