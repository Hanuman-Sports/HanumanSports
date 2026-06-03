const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { addProduct, getProducts, addToCart, checkout } = require('../controllers/shopController');

router.get('/products', getProducts);
router.post('/products/add', verifyToken, adminAuth, addProduct);
router.post('/cart/add', verifyToken, addToCart);
router.post('/checkout', verifyToken, checkout);

module.exports = router;