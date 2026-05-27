const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    let item = await Cart.findOne({ where: { userId: req.userId, productId } });
    if (item) {
        item.quantity += quantity;
        await item.save();
    } else {
        await Cart.create({ userId: req.userId, productId, quantity });
    }
    res.json({ msg: "Added to cart" });
};

exports.checkout = async (req, res) => {
    // Basic checkout logic for Hanuman Sports
    await Order.create({ userId: req.userId, totalAmount: req.body.total });
    await Cart.destroy({ where: { userId: req.userId } });
    res.json({ msg: "Order placed successfully" });
};