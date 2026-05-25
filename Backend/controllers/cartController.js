const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId: req.userId }
        });
        
        const cartWithProducts = [];
        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                cartWithProducts.push({
                    id: item.id,
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: item.quantity
                });
            }
        }
        
        res.json(cartWithProducts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.userId;

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item already in cart
        const existingItem = await Cart.findOne({ where: { userId, productId } });
        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.json({ message: 'Cart updated', cartItem: existingItem });
        }

        // Add new item to cart
        const cartItem = await Cart.create({ userId, productId, quantity });
        res.status(201).json({ message: 'Added to cart', cartItem });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.userId;

        const deleted = await Cart.destroy({ where: { id: itemId, userId } });
        if (deleted) {
            res.json({ message: 'Item removed from cart' });
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update cart item quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.userId;

        const cartItem = await Cart.findOne({ where: { id: itemId, userId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.json({ message: 'Quantity updated', cartItem });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};