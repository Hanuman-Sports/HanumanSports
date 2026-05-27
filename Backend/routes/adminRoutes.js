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
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ success: false, message: "Database insertion failed", error: error.message });
    }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await product.update(req.body);
        res.json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: "Update failed", error: error.message });
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
        res.status(500).json({ success: false, message: "Delete failed", error: error.message });
    }
});

module.exports = router;