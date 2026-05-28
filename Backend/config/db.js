const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../.env' });

let _realSequelize;
let sequelize;

try {
    _realSequelize = new Sequelize(
        process.env.DB_NAME || 'hanuman_sports',
        process.env.DB_USER || 'avnadmin',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
            port: process.env.DB_PORT || 3306,
            logging: false,
            dialectOptions: {
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
            }
        }
    );
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
        static async count() { return 0; }
        static async destroy() { return 0; }
        static async update() { return [0]; }
        static async upsert() { return [null, false]; }
        static async sync() {}
        static belongsTo() {}
        static hasMany() {}
        static belongsToMany() {}
        static findAllPaginated() { return Promise.resolve({ rows: [], count: 0 }); }
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
        console.log('✅ MySQL Connected via Sequelize');
        await _realSequelize.sync();
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.warn('⚠️  Static frontend will still run; product pages use offline fallbacks until MySQL is available.');
        return false;
    }
};

module.exports = { sequelize, connectDB };