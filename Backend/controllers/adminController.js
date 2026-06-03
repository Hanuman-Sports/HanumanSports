const { sequelize } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const products = await Product.findAll({ attributes: [[sequelize.fn('SUM', sequelize.col('stock')), 'total']] });
        const stockCount = products[0].dataValues.total || 0;
        
        res.json({
            userCount: userCount,
            stockCount: stockCount,
            revenue: 0, 
            pendingOrders: 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

exports.addStock = async (req, res) => {
    const { name, category, price, stock, image, original_price, rating, badge } = req.body;
    try {
        const product = await Product.create({ name, category, price, stock, image, original_price, rating, badge });
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add product' });
    }
};