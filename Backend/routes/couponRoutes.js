const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { verifyToken } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/validate', async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        if (!code) return res.json({ valid: false, msg: 'Coupon code is required' });

        const coupon = await Coupon.findOne({
            where: {
                code: code,
                is_active: 1,
                [Op.and]: [
                    { [Op.or]: [{ valid_from: { [Op.lte]: new Date() } }, { valid_from: null }] },
                    { [Op.or]: [{ valid_till: { [Op.gte]: new Date() } }, { valid_till: null }] }
                ]
            }
        });

        if (!coupon) return res.json({ valid: false, msg: 'Invalid or expired coupon code' });

        const parsedMin = parseFloat(coupon.min_cart_value);
        if (cartTotal && parsedMin > 0 && parseFloat(cartTotal) < parsedMin) {
            return res.json({ valid: false, msg: `Minimum cart value of ₹${parsedMin} required` });
        }

        if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
            return res.json({ valid: false, msg: 'This coupon has reached its usage limit' });
        }

        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round((parseFloat(cartTotal || 0) * parseFloat(coupon.discount_value)) / 100);
            if (coupon.max_discount && discountAmount > parseFloat(coupon.max_discount)) {
                discountAmount = parseFloat(coupon.max_discount);
            }
        } else {
            discountAmount = parseFloat(coupon.discount_value);
        }

        const finalTotal = Math.max(0, parseFloat(cartTotal || 0) - discountAmount);

        res.json({
            valid: true,
            coupon: {
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: parseFloat(coupon.discount_value),
                max_discount: coupon.max_discount ? parseFloat(coupon.max_discount) : null
            },
            discountAmount: Math.round(discountAmount * 100) / 100,
            finalTotal: Math.round(finalTotal * 100) / 100
        });
    } catch (err) {
        console.error('Coupon validate error:', err);
        res.status(500).json({ valid: false, msg: 'Server error' });
    }
});

// Admin-only coupon management
router.get('/', adminAuth, async (req, res) => {
    try {
        const coupons = await Coupon.findAll({ order: [['id', 'DESC']] });
        res.json({ success: true, coupons });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

router.post('/', adminAuth, async (req, res) => {
    try {
        const { code, discount_type, discount_value, min_cart_value, max_discount, usage_limit, is_active, valid_from, valid_till } = req.body;
        const coupon = await Coupon.create({
            code, discount_type, discount_value,
            min_cart_value: min_cart_value || 0,
            max_discount: max_discount || null,
            usage_limit: usage_limit || 100,
            used_count: 0,
            is_active: is_active !== undefined ? is_active : 1,
            valid_from: valid_from || null,
            valid_till: valid_till || null
        });
        res.json({ success: true, coupon });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Failed to create coupon' });
    }
});

router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { code, discount_type, discount_value, min_cart_value, max_discount, usage_limit, is_active, valid_from, valid_till } = req.body;
        const updates = {};
        if (code !== undefined) updates.code = code;
        if (discount_type !== undefined) updates.discount_type = discount_type;
        if (discount_value !== undefined) updates.discount_value = discount_value;
        if (min_cart_value !== undefined) updates.min_cart_value = min_cart_value;
        if (max_discount !== undefined) updates.max_discount = max_discount;
        if (usage_limit !== undefined) updates.usage_limit = usage_limit;
        if (is_active !== undefined) updates.is_active = is_active;
        if (valid_from !== undefined) updates.valid_from = valid_from;
        if (valid_till !== undefined) updates.valid_till = valid_till;
        await Coupon.update(updates, { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Failed to update coupon' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        await Coupon.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

module.exports = router;
