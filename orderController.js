const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

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

        const newOrder = await Order.create({
            userId: req.userId,
            totalAmount: totalAmount
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