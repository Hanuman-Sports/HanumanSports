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
        res.status(500).json({ message: 'Failed to load cart' });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.userId;

        const qty = parseInt(quantity);
        if (!qty || qty < 1 || qty > 99) {
            return res.status(400).json({ message: 'Quantity must be between 1 and 99' });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock !== undefined && product.stock < qty) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const existingItem = await Cart.findOne({ where: { userId, productId } });
        if (existingItem) {
            const newQty = existingItem.quantity + qty;
            if (newQty > 99) {
                return res.status(400).json({ message: 'Maximum quantity is 99 per item' });
            }
            existingItem.quantity = newQty;
            await existingItem.save();
            return res.json({ message: 'Cart updated', cartItem: existingItem });
        }

        const cartItem = await Cart.create({ userId, productId, quantity: qty });
        res.status(201).json({ message: 'Added to cart', cartItem });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add to cart' });
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
        res.status(500).json({ message: 'Failed to remove item' });
    }
};

// Update cart item quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.userId;

        const qty = parseInt(quantity);
        if (!qty || qty < 1 || qty > 99) {
            return res.status(400).json({ message: 'Quantity must be between 1 and 99' });
        }

        const cartItem = await Cart.findOne({ where: { id: itemId, userId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = qty;
        await cartItem.save();
        res.json({ message: 'Quantity updated', cartItem });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update quantity' });
    }
};