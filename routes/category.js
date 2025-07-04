const express = require("express");
const router = express.Router();
const category = require("../controllers/category");

const { createCategory } = require('../controllers/category');

router.post("/", createCategory);
router.get('/all', category.getAllCategories)
router.get('/:id', category.getCategoryById)
router.delete('/:id',category.deleteCategoryrById)


module.exports = router;
