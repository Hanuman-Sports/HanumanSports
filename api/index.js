// Explicit require so Vercel bundles mysql2 (Sequelize loads it dynamically)
require('mysql2');
const app = require('../Backend/server');
module.exports = app;
