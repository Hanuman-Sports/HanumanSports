const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Checkout: Process the order and clear the cart
router.post('/checkout', verifyToken, orderController.checkout);

// Create order (used by Razorpay/Cash-on-delivery frontend)
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { items, total, shipping_address, payment_method, coupon_code, discount_amount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        // Increment coupon usage if a valid coupon was applied
        if (coupon_code && discount_amount > 0) {
            try {
                const Coupon = require('../models/Coupon');
                await Coupon.increment('used_count', { where: { code: coupon_code } });
            } catch(e) { console.error('Coupon increment error:', e); }
        }

        const newOrder = await Order.create({
            userId: req.userId,
            totalAmount: total,
            status: payment_method === 'cod' ? 'Confirmed' : 'Pending',
            discountAmount: discount_amount || 0,
            couponCode: coupon_code || null
        });

        // Clear user's cart after order
        await Cart.destroy({ where: { userId: req.userId } });

        res.status(201).json({ 
            success: true, 
            message: 'Order created successfully', 
            order: newOrder 
        });
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// Get user orders
router.get('/', verifyToken, orderController.getUserOrders);

// Lookup order by ID and email (public endpoint)
router.get('/lookup', orderController.lookupOrder);

module.exports = router;