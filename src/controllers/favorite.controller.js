import Favorite from '../models/Favorite.js';

export async function list(req, res, next) {
  try {
    const favs = await Favorite.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 })
      .lean();
    res.json(favs.map((f) => f.productId).filter(Boolean));
  } catch (err) { next(err); }
}

export async function toggle(req, res, next) {
  try {
    const { productId } = req.params;
    const existing = await Favorite.findOne({ userId: req.user._id, productId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ favorited: false });
    }
    await Favorite.create({ userId: req.user._id, productId });
    res.json({ favorited: true });
  } catch (err) { next(err); }
}

export async function remove(req, res, next) {
  try {
    await Favorite.deleteOne({ userId: req.user._id, productId: req.params.productId });
    res.json({ favorited: false });
  } catch (err) { next(err); }
}
