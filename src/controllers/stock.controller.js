import StockNotification from '../models/StockNotification.js';
import Product from '../models/Product.js';

export async function subscribe(req, res, next) {
  try {
    const { email, productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await StockNotification.findOne({ email, productId });
    if (existing) return res.status(409).json({ message: 'Already subscribed' });

    const notification = await StockNotification.create({ email, productId });
    res.status(201).json(notification);
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const list = await StockNotification.find({ notified: false })
      .populate('productId', 'name slug')
      .lean();
    res.json(list);
  } catch (err) { next(err); }
}
