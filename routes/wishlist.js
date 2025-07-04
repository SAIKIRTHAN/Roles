const express = require('express');
const router = express.Router();
const wishlist = require('../controllers/wishlist');
const auth = require('../Middleware/auth');

router.post('/add-to-wishlist', auth.authenticate, wishlist.addToWishlist);
router.get('/',auth.authenticate, wishlist.getWishlist);
router.delete('/:productId',auth.authenticate, wishlist.removeFromWishlist);

module.exports = router;
