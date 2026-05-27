const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { addProduct, getProducts, addToCart, checkout } = require('../controllers/shopController');

router.get('/products', getProducts);
router.post('/products/add', verifyToken, addProduct);
router.post('/cart/add', verifyToken, addToCart);
router.post('/checkout', verifyToken, checkout);

module.exports = router;