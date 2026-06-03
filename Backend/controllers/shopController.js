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
    } catch (err) { res.status(500).json({ message: 'Failed to add product' }); }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load products' });
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
        res.status(500).json({ message: 'Failed to add to cart' });
    }
};

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

        // Generate unique order number
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

        const order = await Order.create({ userId: req.userId, totalAmount, orderNumber, items: orderItems });
        await Cart.destroy({ where: { userId: req.userId } });
        res.json({ msg: "Order placed successfully", orderNumber, order });
    } catch (err) {
        res.status(500).json({ message: 'Failed to place order' });
    }
};