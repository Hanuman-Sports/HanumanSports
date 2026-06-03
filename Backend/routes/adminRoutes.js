const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/db');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Product = require('../models/Product');

// Admin stats route
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const userCount = await User.count();
        const productCount = await Product.count();
        const stockResult = await Product.findAll({ 
            attributes: [[sequelize.fn('SUM', sequelize.col('stock')), 'total']] 
        });
        const stockCount = stockResult[0]?.dataValues?.total || 0;

        const categories = await Product.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('category'))), 'categoryCount']]
        });
        const categoryCount = categories[0]?.dataValues?.categoryCount || 0;

        res.json({
            success: true,
            stats: {
                products: productCount,
                categories: categoryCount,
                stock: parseInt(stockCount, 10)
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, message: "Error fetching stats" });
    }
});

// Add product
router.post('/products', adminAuth, async (req, res) => {
    try {
        const { name, category, sub_category, price, original_price, stock, image, rating, badge, description } = req.body;
        const product = await Product.create({
            name, category, sub_category: sub_category || null,
            price, original_price: original_price || null,
            stock: stock || 0, image: image || 'logo.png',
            rating: rating || 4.5, badge: badge || null,
            description: description || ''
        });
        res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ success: false, message: 'Failed to add product' });
    }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const { name, category, sub_category, price, original_price, stock, image, rating, badge, description } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (category !== undefined) updates.category = category;
        if (sub_category !== undefined) updates.sub_category = sub_category;
        if (price !== undefined) updates.price = price;
        if (original_price !== undefined) updates.original_price = original_price;
        if (stock !== undefined) updates.stock = stock;
        if (image !== undefined) updates.image = image;
        if (rating !== undefined) updates.rating = rating;
        if (badge !== undefined) updates.badge = badge;
        if (description !== undefined) updates.description = description;
        await product.update(updates);
        res.json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await product.destroy();
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
});

module.exports = router;