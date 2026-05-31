const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.addProduct = async (req, res) => {
    try {
        const { name, category, sub_category, price, original_price, stock, image, rating, badge } = req.body;
        const product = await Product.create({
            name, category, sub_category: sub_category || null,
            price, original_price: original_price || null,
            stock: stock || 0, image: image || 'logo.png',
            rating: rating || 4.5, badge: badge || null
        });
        res.status(201).json(product);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let item = await Cart.findOne({ where: { userId: req.userId, productId } });
        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            await Cart.create({ userId: req.userId, productId, quantity });
        }
        res.json({ msg: "Added to cart" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkout = async (req, res) => {
    try {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(100 + Math.random() * 900).toString();
        const orderNumber = `HS${timestamp}${random}`;
        await Order.create({ userId: req.userId, totalAmount: req.body.total, orderNumber });
        await Cart.destroy({ where: { userId: req.userId } });
        res.json({ msg: "Order placed successfully", orderNumber });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};