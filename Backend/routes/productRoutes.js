const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Product = require('../models/Product');

function formatProduct(p) {
    const image = p.image || p.main_image || 'logo.png';
    return {
        id: p.id,
        name: p.name,
        description: p.description || '',
        category: p.category,
        sub_category: p.sub_category || null,
        price: parseFloat(p.price),
        original_price: p.original_price ? parseFloat(p.original_price) : null,
        image,
        main_image: image,
        rating: p.rating ? parseFloat(p.rating) : 4.5,
        reviews_count: p.reviews_count || 0,
        badge: p.badge || null,
        stock: p.stock
    };
}

router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const whereClause = {};

        if (category) {
            whereClause.category = { [Op.like]: `%${category}%` };
        }

        if (search) {
            const term = `%${search}%`;
            whereClause[Op.or] = [
                { name: { [Op.like]: term } },
                { category: { [Op.like]: term } }
            ];
        }

        const products = await Product.findAll({ where: whereClause });
        res.json({
            success: true,
            products: products.map(formatProduct)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error fetching products', products: [] });
    }
});

module.exports = router;
