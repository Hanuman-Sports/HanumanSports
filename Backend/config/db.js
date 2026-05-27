const { Sequelize } = require('sequelize');
require('dotenv').config({ path: __dirname + '/../.env' });

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false,
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connected via Sequelize');
        await sequelize.sync();
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.warn('⚠️  Static frontend will still run; product pages use offline fallbacks until MySQL is available.');
        return false;
    }
};

module.exports = { sequelize, connectDB };