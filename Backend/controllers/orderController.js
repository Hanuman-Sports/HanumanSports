const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.checkout = async (req, res) => {
    try {
        const { items, total, shipping_address, payment_method } = req.body;

        const newOrder = await Order.create({
            userId: req.userId,
            totalAmount: total,
            items: items,
            shipping_address: shipping_address,
            payment_method: payment_method || 'cod',
            status: 'Pending'
        });

        // Optionally clear the cart in DB if you use DB cart
        // await Cart.destroy({ where: { userId: req.userId } });

        res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

exports.createOrder = exports.checkout;

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.userId }, order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};