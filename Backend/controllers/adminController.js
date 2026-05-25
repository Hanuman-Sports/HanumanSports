const { sequelize } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const productCount = await Product.count();
        const products = await Product.findAll({ attributes: [[sequelize.fn('SUM', sequelize.col('stock')), 'total']] });
        const stockCount = products[0].dataValues.total || 0;
        const categories = await Product.findAll({ attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']] });

        const revenueResult = await Order.findAll({
            attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue']]
        });
        const revenue = revenueResult[0].dataValues.totalRevenue || 0;

        const pendingOrders = await Order.count({
            where: { status: 'Pending' }
        });

        res.json({
            userCount: userCount,
            productCount: productCount,
            stockCount: stockCount,
            categoryCount: categories.length,
            revenue: parseFloat(revenue),
            pendingOrders: pendingOrders
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

exports.addStock = async (req, res) => {
    const { name, category, sub_category, price, stock, image, original_price, rating, badge } = req.body;
    try {
        const product = await Product.create({ name, category, sub_category, price, stock, image, original_price, rating, badge });
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Database insertion failed", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await Product.update(req.body, { where: { id: req.params.id } });
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};