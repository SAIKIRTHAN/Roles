const models = require('../models');


exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    const { product_id } = req.body;

    const [wishlist, created] = await models.Wishlist.findOrCreate({
      where: { user_id:userId, product_id }
    });

    if (!created) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    res.status(201).json({ message: 'Added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getWishlist = async (req, res) => {
  try {
    const userId = req.headers['x-user-id']

    const wishlist = await models.Wishlist.findAll({
      where: { user_id:userId },
      include: [{ model: models.Product }]
    });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    const { productId } = req.params;

    const deleted = await models.Wishlist.destroy({
      where: { user_id:userId, product_id: productId }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
