const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

exports.checkout = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({ where: { userId: req.userId } });
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const cartItem of cartItems) {
            const product = await Product.findByPk(cartItem.productId);
            if (product) {
                totalAmount += product.price * cartItem.quantity;
                orderItems.push({
                    productId: product.id,
                    name: product.name,
                    quantity: cartItem.quantity,
                    priceAtPurchase: product.price
                });
            }
        }

        // Generate order number: HS + timestamp + random 3 digits
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(100 + Math.random() * 900).toString();
        const orderNumber = `HS${timestamp}${random}`;

        const newOrder = await Order.create({
            userId: req.userId,
            totalAmount: totalAmount,
            orderNumber: orderNumber
        });

        await Cart.destroy({ where: { userId: req.userId } });
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.userId }, order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.lookupOrder = async (req, res) => {
    try {
        const { orderId, email } = req.query;
        if (!orderId || !email) {
            return res.status(400).json({ message: 'Order ID and email are required' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find order by ID and userId
        const order = await Order.findOne({ where: { id: orderId, userId: user.id } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ order });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};