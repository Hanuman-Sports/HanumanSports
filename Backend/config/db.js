const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: __dirname + '/../.env' });

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const storagePath = path.join(dataDir, 'hanuman_sports.sqlite');

let _realSequelize;
let sequelize;

try {
    _realSequelize = new Sequelize({
        dialect: 'sqlite',
        storage: storagePath,
        logging: false,
        define: {
            underscored: false,
            timestamps: false
        }
    });
    sequelize = _realSequelize;
} catch (err) {
    console.warn('⚠️  Sequelize init failed at module load:', err.message);
    const mockModels = new Map();
    sequelize = {
        define: (name, attrs, opts) => {
            const model = createMockModel(name);
            mockModels.set(name, model);
            return model;
        },
        authenticate: async () => { throw new Error('DB not available'); },
        sync: async () => {},
        close: async () => {},
        model: (name) => mockModels.get(name),
        models: {},
        query: async () => [],
        transaction: async (fn) => fn({}),
    };
}

function createMockModel(name) {
    class MockModel {
        static modelName = name;
        static rawAttributes = {};
        static tableName = name;
        static init() {}
        static async findAll() { return []; }
        static async findOne() { return null; }
        static async findByPk() { return null; }
        static async create(data) { return { ...data, id: Date.now(), save: async () => {} }; }
        static async findOrCreate(opts) { return [opts.defaults || {}, false]; }
        static async findAndCountAll() { return { count: 0, rows: [] }; }
        static async count() { return 0; }
        static async destroy() { return 0; }
        static async update() { return [0]; }
        static async increment() { return [{}]; }
        static async bulkCreate() { return []; }
        static async upsert() { return [null, false]; }
        static async sync() {}
        static belongsTo() {}
        static hasMany() {}
        static belongsToMany() {}
        async save() { return this; }
        async destroy() { return this; }
        toJSON() { return {}; }
    }
    return MockModel;
}

const connectDB = async () => {
    if (!_realSequelize) {
        console.warn('⚠️  Sequelize not initialized — skipping DB sync');
        return false;
    }
    try {
        await _realSequelize.authenticate();
        console.log('✅ SQLite Connected via Sequelize');
        await _realSequelize.sync();
        console.log('✅ Tables synced');
        await autoSeed(_realSequelize);
        return true;
    } catch (error) {
        console.error('❌ Database error:', error.message);
        return false;
    }
};

async function autoSeed(db) {
    try {
        const Product = require('../models/Product');
        const Coupon = require('../models/Coupon');
        const count = await Product.count();
        if (count > 0) return;
        console.log('🌱 Seeding sample data...');
        await Product.bulkCreate([
            { name: 'Yonex GR 303 Aluminium Blend Badminton Racquet', category: 'Badminton', sub_category: 'racket', price: 700, original_price: 965, stock: 50, image: 'https://images.unsplash.com/photo-1587280501635-a19de238a81e?w=400', rating: 4.5, badge: 'New' },
            { name: 'Yonex Astrox Attack 9 G4 Badminton Racquet', category: 'Badminton', sub_category: 'racket', price: 1400, original_price: 2475, stock: 80, image: 'https://images.unsplash.com/photo-1516043827470-d52d5435a122?w=400', rating: 4.5, badge: 'Best Seller' },
            { name: 'SF True Test Leather Cricket Ball', category: 'Cricket', sub_category: 'balls', price: 480, original_price: 550, stock: 68, image: 'https://images.unsplash.com/photo-1614624532983-1fe21c1d1c41?w=400', rating: 4.5, badge: 'Best Seller' },
            { name: 'TON Max Power Kashmir Willow Bat', category: 'Cricket', sub_category: 'bats', price: 2600, original_price: 3140, stock: 40, image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', rating: 4.3, badge: 'Sale' },
            { name: 'Nivia SpotVolley Volleyball', category: 'Balls', sub_category: 'volleyball', price: 1300, original_price: 1580, stock: 100, image: 'https://images.unsplash.com/photo-1592656094267-764a60323e4c?w=400', rating: 4.5 },
            { name: 'Cosco Super Volleyball', category: 'Balls', sub_category: 'volleyball', price: 1350, original_price: 1680, stock: 75, image: 'https://images.unsplash.com/photo-1592656094267-764a60323e4c?w=400', rating: 4.7 },
            { name: 'Tynor Knee Cap Air', category: 'Accessories', sub_category: 'Knee Support', price: 180, original_price: 205, stock: 100, image: 'logo.png', rating: 4.4, badge: 'Sale' },
            { name: 'Tynor UV Protection Arm Sleeve', category: 'Accessories', sub_category: 'Arm Sleeve', price: 450, original_price: 512, stock: 90, image: 'logo.png', rating: 4.2 },
            { name: 'Professional Ball Badminton Racket', category: 'Ball Badminton', sub_category: 'rackets', price: 1499, original_price: 2299, stock: 80, image: 'logo.png', rating: 4.5, badge: 'Best Seller' },
            { name: 'Tournament Grade Balls', category: 'Ball Badminton', sub_category: 'balls', price: 599, original_price: 899, stock: 120, image: 'logo.png', rating: 5, badge: 'New' }
        ]);
        console.log('✅ Seeded 10 products');
        const now = new Date();
        const future = new Date(Date.now() + 365 * 86400000);
        await Coupon.bulkCreate([
            { code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_cart_value: 500, max_discount: 200, usage_limit: 100, used_count: 0, is_active: 1, valid_from: now, valid_till: future },
            { code: 'FLAT200', discount_type: 'flat', discount_value: 200, min_cart_value: 1000, usage_limit: 50, used_count: 0, is_active: 1, valid_from: now, valid_till: future },
            { code: 'FREESHIP', discount_type: 'percentage', discount_value: 100, max_discount: 100, usage_limit: 200, used_count: 0, is_active: 1, valid_from: now, valid_till: future }
        ]);
        console.log('✅ Seeded 3 coupons');
    } catch (e) {
        console.warn('⚠️  Auto-seed skipped:', e.message);
    }
}

module.exports = { sequelize, connectDB };