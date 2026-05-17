/**
 * Seed sample products (run after MySQL is up and .env is configured).
 * Usage: node scripts/seedProducts.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Product = require('../models/Product');
const { connectDB, sequelize } = require('../config/db');

const samples = [
    { name: 'Yonex GR 303 Aluminium Blend Badminton Racquet', category: 'Badminton', sub_category: 'racket', price: 700, original_price: 965, stock: 50, image: 'https://images.unsplash.com/photo-1587280501635-a19de238a81e?w=400', rating: 4.5, badge: 'New' },
    { name: 'SF True Test Leather Cricket Ball', category: 'Cricket', sub_category: 'balls', price: 480, original_price: 550, stock: 68, image: 'https://images.unsplash.com/photo-1614624532983-1fe21c1d1c41?w=400', rating: 4.5, badge: 'Best Seller' },
    { name: 'Nivia SpotVolley Volleyball', category: 'Balls', sub_category: 'volleyball', price: 1300, original_price: 1580, stock: 100, image: 'https://images.unsplash.com/photo-1592656094267-764a60323e4c?w=400', rating: 4.5, badge: null },
    { name: 'Tynor Knee Cap Air', category: 'Accessories', sub_category: 'Knee Support', price: 180, original_price: 205, stock: 100, image: 'logo.png', rating: 4.4, badge: 'Sale' },
    { name: 'Professional Ball Badminton Racket', category: 'Ball Badminton', sub_category: 'rackets', price: 1499, original_price: 2299, stock: 80, image: 'logo.png', rating: 4.5, badge: 'Best Seller' }
];

(async () => {
    const ok = await connectDB();
    if (!ok) {
        process.exit(1);
    }

    const existing = await Product.count();
    if (existing > 0) {
        console.log(`Products table already has ${existing} rows. Skipping seed.`);
        await sequelize.close();
        return;
    }

    await Product.bulkCreate(samples);
    console.log(`Seeded ${samples.length} products.`);
    await sequelize.close();
})();
