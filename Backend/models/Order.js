const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderNumber: { type: DataTypes.STRING, unique: true, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    discountAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
    couponCode: { type: DataTypes.STRING, allowNull: true },
    items: { type: DataTypes.JSON, allowNull: true },
    shippingAddress: { type: DataTypes.TEXT, allowNull: true },
    paymentMethod: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'Orders',
    timestamps: true
});