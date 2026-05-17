const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');

// Admin stats route
router.get('/stats', verifyToken, adminController.getStats);

// Add product route
router.post('/products/add', verifyToken, adminController.addStock);

module.exports = router;