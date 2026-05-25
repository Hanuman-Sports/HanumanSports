const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    items: { type: DataTypes.JSON, allowNull: true },
    shipping_address: { type: DataTypes.TEXT, allowNull: true },
    payment_method: { type: DataTypes.STRING, defaultValue: 'cod' }
});