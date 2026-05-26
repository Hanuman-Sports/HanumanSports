const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Coupon = sequelize.define('Coupon', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    discount_type: { type: DataTypes.ENUM('percentage', 'flat'), defaultValue: 'percentage' },
    discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    min_cart_value: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    max_discount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    usage_limit: { type: DataTypes.INTEGER, defaultValue: 0 },
    used_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    valid_from: { type: DataTypes.DATE, allowNull: true },
    valid_till: { type: DataTypes.DATE, allowNull: true },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
    tableName: 'Coupons',
    timestamps: false
});

module.exports = Coupon;
