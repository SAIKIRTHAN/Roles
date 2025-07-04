const models = require('../models')

exports.addToCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { product_id, quantity = 1 } = req.body;

    const [cartItem, created] = await models.Cart.findOrCreate({
      where: { user_id: userId, product_id },
      defaults: { quantity }
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ message: 'Cart updated', cartItem });
    }

    res.status(201).json({ message: 'Added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    const cart = await models.Cart.findAll({
      where: { user_id: userId },
      include: [{ model: models.Product }]
    });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId } = req.params;

    const deleted = await models.Cart.destroy({
      where: { user_id: userId, product_id: productId }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

