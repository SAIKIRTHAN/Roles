const models = require("../models");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await models.Category.create({
      name
    });
    res.status(201).json({ message: "Category created", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await models.Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  const data = await models.Category.findOne({
    where: {
      id: categoryId
    }
  })
  res.status(200).send({ data })
};

exports.deleteCategoryrById = async (req, res) => {
  const categoryId = req.params.id;
  const data = await models.Category.destroy({
    where: {
      id: categoryId
    }
  })
  res.status(200).send({ data })
};



