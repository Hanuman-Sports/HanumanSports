const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');

// Checkout: Process the order and clear the cart
router.post('/checkout', verifyToken, orderController.checkout);

// Create order (used by Razorpay/Cash-on-delivery frontend)
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { items, shipping_address, payment_method, coupon_code } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        // Verify and compute total server-side
        let computedTotal = 0;
        const verifiedItems = [];
        for (const item of items) {
            const product = await Product.findByPk(item.id || item.productId);
            if (!product) {
                return res.status(400).json({ success: false, message: `Product not found: ${item.id || item.productId}` });
            }
            const qty = Math.max(1, parseInt(item.quantity) || 1);
            computedTotal += parseFloat(product.price) * qty;
            verifiedItems.push({
                productId: product.id,
                name: product.name,
                quantity: qty,
                priceAtPurchase: parseFloat(product.price)
            });
        }

        // Validate coupon server-side
        let discountAmount = 0;
        if (coupon_code) {
            const coupon = await Coupon.findOne({ where: { code: coupon_code, is_active: 1 } });
            if (!coupon) {
                return res.status(400).json({ success: false, message: 'Invalid coupon code' });
            }
            if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
                return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
            }
            if (coupon.discount_type === 'percentage') {
                discountAmount = Math.round((computedTotal * parseFloat(coupon.discount_value)) / 100);
                if (coupon.max_discount && discountAmount > parseFloat(coupon.max_discount)) {
                    discountAmount = parseFloat(coupon.max_discount);
                }
            } else {
                discountAmount = parseFloat(coupon.discount_value);
            }
            discountAmount = Math.min(discountAmount, computedTotal);
            await Coupon.increment('used_count', { where: { code: coupon_code } });
        }

        // Generate unique order number with collision retry
        let orderNumber;
        for (let attempt = 0; attempt < 5; attempt++) {
            const ts = Date.now().toString().slice(-6);
            const rand = Math.floor(100 + Math.random() * 900).toString();
            orderNumber = `HS${ts}${rand}`;
            const existing = await Order.findOne({ where: { orderNumber } });
            if (!existing) break;
            if (attempt === 4) {
                orderNumber = `HS${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
            }
        }

        const finalTotal = Math.max(0, computedTotal - discountAmount);

        const newOrder = await Order.create({
            userId: req.userId,
            totalAmount: finalTotal,
            status: payment_method === 'cod' ? 'Confirmed' : 'Pending',
            discountAmount,
            couponCode: coupon_code || null,
            orderNumber,
            items: verifiedItems,
            shippingAddress: shipping_address || null,
            paymentMethod: payment_method || null
        });

        await Cart.destroy({ where: { userId: req.userId } });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

// Get user orders
router.get('/', verifyToken, orderController.getUserOrders);

// Alias routes for frontend compatibility
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/my', verifyToken, orderController.getUserOrders);

// Lookup order by ID and email (public endpoint)
router.get('/lookup', orderController.lookupOrder);

module.exports = router;