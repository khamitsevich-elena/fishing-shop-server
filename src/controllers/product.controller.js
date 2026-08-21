import Category from '../models/Category.js';
import Product from '../models/Product.js';

export async function list(req, res, next) {
  try {
    const { category, fish, method, season, brand, inStock, hasDiscount, priceFrom, priceTo, q, sort, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        const childIds = await Category.find({ parentId: cat._id }).distinct('_id');
        const ids = [cat._id, ...childIds];
        filter.categoryId = { $in: ids };
      }
    }
    if (fish) filter.fishTags = fish;
    if (method) filter.methodTags = method;
    if (season) filter.seasonTags = season;
    if (brand) filter.brand = brand;
    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (hasDiscount === 'true') filter.oldPrice = { $ne: null, $exists: true };
    if (priceFrom || priceTo) {
      filter.price = {};
      if (priceFrom) filter.price.$gte = Number(priceFrom);
      if (priceTo) filter.price.$lte = Number(priceTo);
    }
    if (q) filter.$text = { $search: q };

    const sortMap = {
      popular: { popularity: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      new: { createdAt: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.popular;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
}

export async function getBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('categoryId', 'name slug parentId')
      .lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
}

export async function similar(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const items = await Product.find({
      _id: { $ne: product._id },
      categoryId: product.categoryId,
      $or: [
        { fishTags: { $in: product.fishTags } },
        { methodTags: { $in: product.methodTags } },
      ],
    }).limit(6).sort({ popularity: -1 }).lean();

    res.json(items);
  } catch (err) { next(err); }
}
