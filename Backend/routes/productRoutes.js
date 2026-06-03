const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Product = require('../models/Product');

function formatProduct(p) {
    const image = p.image || 'logo.png';
    return {
        id: p.id,
        name: p.name,
        description: p.description || '',
        category: p.category,
        sub_category: p.sub_category || null,
        price: parseFloat(p.price),
        original_price: p.original_price ? parseFloat(p.original_price) : null,
        image,
        rating: p.rating ? parseFloat(p.rating) : 4.5,
        reviews_count: p.reviews_count || 0,
        badge: p.badge || null,
        stock: p.stock
    };
}

function escapeLike(str) {
    return str.replace(/[%_]/g, m => '\\' + m);
}

router.get('/', async (req, res) => {
    try {
        const { category, search, sort_by, min_price, max_price, page, limit } = req.query;
        const whereClause = {};

        if (category) {
            whereClause.category = { [Op.like]: `%${category}%` };
        }

        if (search) {
            const term = `%${escapeLike(search)}%`;
            whereClause[Op.or] = [
                { name: { [Op.like]: term } },
                { category: { [Op.like]: term } }
            ];
        }

        if (min_price || max_price) {
            whereClause.price = {};
            if (min_price) whereClause.price[Op.gte] = parseFloat(min_price);
            if (max_price) whereClause.price[Op.lte] = parseFloat(max_price);
        }

        let order = [['id', 'ASC']];
        if (sort_by === 'price_asc') order = [['price', 'ASC']];
        else if (sort_by === 'price_desc') order = [['price', 'DESC']];
        else if (sort_by === 'name') order = [['name', 'ASC']];
        else if (sort_by === 'rating') order = [['rating', 'DESC']];
        else if (sort_by === 'newest') order = [['id', 'DESC']];

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const offset = (pageNum - 1) * limitNum;

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            order,
            offset,
            limit: limitNum
        });

        res.json({
            success: true,
            products: rows.map(formatProduct),
            total: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error fetching products', products: [] });
    }
});

module.exports = router;
