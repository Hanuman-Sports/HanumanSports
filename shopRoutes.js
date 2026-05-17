const router = require('express').Router();
const auth = require('../middleware/auth');
const { addProduct, getProducts, addToCart, checkout } = require('../controllers/shopController');

router.get('/products', getProducts);
router.post('/products/add', auth, addProduct);
router.post('/cart/add', auth, addToCart);
router.post('/checkout', auth, checkout);

module.exports = router;