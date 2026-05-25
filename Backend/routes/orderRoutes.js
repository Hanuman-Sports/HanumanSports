const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

// Checkout: Process the order and clear the cart
router.post('/checkout', verifyToken, orderController.checkout);
router.post('/create', verifyToken, orderController.createOrder);
router.get('/user-orders', verifyToken, orderController.getUserOrders);

module.exports = router;