const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { addToCart, getCart } = require('../controllers/cartController');

router.post('/add', verifyToken, addToCart);
router.get('/', verifyToken, getCart);

module.exports = router;