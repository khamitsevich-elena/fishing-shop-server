import Cart from '../models/Cart.js';

export async function getCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    res.json(cart || { items: [] });
  } catch (err) { next(err); }
}

export async function updateCart(req, res, next) {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: Array.isArray(items) ? items : [] },
      { upsert: true, new: true },
    );
    res.json(cart);
  } catch (err) { next(err); }
}
