const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { addToCart, getCart, removeFromCart, updateQuantity } = require('../controllers/cartController');

router.post('/', verifyToken, addToCart);
router.post('/add', verifyToken, addToCart);
router.get('/', verifyToken, getCart);
router.delete('/:itemId', verifyToken, removeFromCart);
router.put('/:itemId', verifyToken, updateQuantity);

module.exports = router;