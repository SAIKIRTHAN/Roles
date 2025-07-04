'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productName: DataTypes.STRING,
    description: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.hasMany(models.Wishlist, { foreignKey: 'product_id' });
    Product.hasMany(models.Cart, { foreignKey: 'product_id' });

  };

  return Product;
};
