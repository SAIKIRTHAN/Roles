const express = require('express');
const router = express.Router();
const product = require('../controllers/products')

const { createProduct } = require('../controllers/products');

router.post('/', createProduct);
router.get('/all', product.getAllproducts)
router.post('/products-by-category', product.getProductsByCategory);
router.delete('/:id',product.deleteProductsById)
router.get('/:id',product.getProductsById)


module.exports = router;
