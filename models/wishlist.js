'use strict';

module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {});

  Wishlist.associate = function(models) {
    Wishlist.belongsTo(models.user, { foreignKey: 'user_id' });
    Wishlist.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Wishlist;
};
