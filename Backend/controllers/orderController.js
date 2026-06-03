const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

async function generateUniqueOrderNumber() {
    for (let attempt = 0; attempt < 10; attempt++) {
        const ts = Date.now().toString().slice(-6);
        const rand = Math.floor(100 + Math.random() * 900).toString();
        const orderNumber = `HS${ts}${rand}`;
        const existing = await Order.findOne({ where: { orderNumber } });
        if (!existing) return orderNumber;
    }
    return `HS${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
}

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
                totalAmount += parseFloat(product.price) * cartItem.quantity;
                orderItems.push({
                    productId: product.id,
                    name: product.name,
                    quantity: cartItem.quantity,
                    priceAtPurchase: parseFloat(product.price)
                });
            }
        }

        const orderNumber = await generateUniqueOrderNumber();

        const newOrder = await Order.create({
            userId: req.userId,
            totalAmount,
            orderNumber,
            items: orderItems
        });

        await Cart.destroy({ where: { userId: req.userId } });
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Failed to place order' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.userId }, order: [['createdAt', 'DESC']] });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load orders' });
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

        // Find order by orderNumber (string like HS123456) or ID and userId
        const where = /^HS\d+$/i.test(orderId)
            ? { orderNumber: orderId, userId: user.id }
            : { id: orderId, userId: user.id };
        const order = await Order.findOne({ where });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ order });
    } catch (err) {
        res.status(500).json({ message: 'Failed to look up order' });
    }
};