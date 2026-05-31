const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');

function formatProduct(p) {
    const image = p.image || 'logo.png';
    return {
        id: p.id, name: p.name, category: p.category,
        price: parseFloat(p.price),
        original_price: p.original_price ? parseFloat(p.original_price) : null,
        image, rating: p.rating ? parseFloat(p.rating) : 4.5,
        reviews_count: p.reviews_count || 0, badge: p.badge || null, stock: p.stock
    };
}

router.get('/', verifyToken, async (req, res) => {
    try {
        const items = await Wishlist.findAll({
            where: { user_id: req.userId },
            include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price', 'original_price', 'image', 'rating', 'reviews_count', 'badge', 'stock', 'category'] }]
        });
        // If include doesn't work (alias mismatch), fallback to manual fetch
        let products = [];
        if (items.length > 0 && items[0].product) {
            products = items.map(w => formatProduct(w.product));
        } else {
            const productIds = items.map(w => w.product_id);
            if (productIds.length > 0) {
                const dbProducts = await Product.findAll({ where: { id: productIds } });
                const map = {};
                dbProducts.forEach(p => { map[p.id] = formatProduct(p); });
                products = productIds.map(id => map[id]).filter(Boolean);
            }
        }
        res.json({ success: true, products, items });
    } catch (err) {
        console.error('Wishlist fetch error:', err);
        res.status(500).json({ success: false, msg: 'Server error', products: [] });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { product_id } = req.body;
        const existing = await Wishlist.findOne({ where: { user_id: req.userId, product_id } });
        if (existing) {
            await existing.destroy();
            return res.json({ success: true, added: false, msg: 'Removed from wishlist' });
        }
        await Wishlist.create({ user_id: req.userId, product_id });
        res.json({ success: true, added: true, msg: 'Added to wishlist' });
    } catch (err) {
        console.error('Wishlist toggle error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

router.delete('/:productId', verifyToken, async (req, res) => {
    try {
        await Wishlist.destroy({ where: { user_id: req.userId, product_id: req.params.productId } });
        res.json({ success: true, msg: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

router.get('/check/:productId', verifyToken, async (req, res) => {
    try {
        const item = await Wishlist.findOne({ where: { user_id: req.userId, product_id: req.params.productId } });
        res.json({ success: true, inWishlist: !!item });
    } catch (err) {
        res.status(500).json({ success: false, inWishlist: false });
    }
});

module.exports = router;
