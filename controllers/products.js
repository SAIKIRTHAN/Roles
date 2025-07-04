const models = require("../models");

exports.createProduct = async (req, res) => {
    try {
        const { productName, description, quantity, category } = req.body;

        const foundCategory = await models.Category.findOne({
            where: { name: category },
        });

        if (!foundCategory) {
            return res.status(400).json({ message: "Category not found" });
        }

        const newProduct = await models.Product.create({
            productName,
            description,
            quantity,
            categoryId: foundCategory.id,
        });

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

exports.getAllproducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const result = await models.Product.findAndCountAll({
            offset,
            limit,
            include: {
                model: models.Category,
                attributes: ['name'],
            },
        });

        const totalPages = Math.ceil(result.count / pageSize);

        res.status(200).json({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems: result.count,
            data: result.rows,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const foundCategory = await models.Category.findOne({
            where: { name: category }
        });

        if (!foundCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const result = await models.Product.findAndCountAll({
            where: { categoryId: foundCategory.id },
            offset,
            limit,
            include: {
                model: models.Category,
                attributes: ['name'],
            },
        });

        const totalPages = Math.ceil(result.count / pageSize);

        res.status(200).json({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems: result.count,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteProductsById = async (req, res) => {
    const productsId = req.params.id;
    const data = await models.Product.destroy({
        where: {
            id: productsId
        }
    })
    res.status(200).send({ data })
};

exports.getProductsById = async (req, res) => {
    const productsId = req.params.id;
    const data = await models.Product.findOne({
        where: {
            id: productsId
        }
    })
    res.status(200).send({data})
};



