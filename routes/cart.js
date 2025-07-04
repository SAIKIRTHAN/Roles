const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart');
const auth = require('../Middleware/auth')


router.post('/add-to-cart', auth.authenticate, cart.addToCart);
router.get('/get-cart', auth.authenticate, cart.getCart);
router.delete('/:productId', auth.authenticate, cart.removeFromCart);

module.exports = router;
