import Review from '../models/Review.js';
import Product from '../models/Product.js';

export async function myReviews(req, res, next) {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate({ path: 'productId', select: 'name slug images price oldPrice brand' })
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews.map((r) => ({ ...r, product: r.productId })));
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviews = await Review.find({ productId: product._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, average: Math.round(avg * 10) / 10, count: reviews.length });
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = await Review.create({
      userId: req.user._id,
      productId: product._id,
      rating: Number(req.body.rating),
      text: req.body.text || '',
    });

    res.status(201).json(review);
  } catch (err) { next(err); }
}
