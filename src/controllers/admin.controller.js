import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import PromoCode from '../models/PromoCode.js';

function handleError(err, next) {
  if (err.name === 'ValidationError') {
    return { status: 400, message: Object.values(err.errors).map((e) => e.message).join(', ') };
  }
  if (err.code === 11000) {
    return { status: 409, message: 'Duplicate value' };
  }
  return next(err);
}

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) { next(err); }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    const handled = handleError(err, next);
    if (handled) return res.status(handled.status).json({ message: handled.message });
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { next(err); }
}

export async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories);
  } catch (err) { next(err); }
}

export async function createCategory(req, res, next) {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    const handled = handleError(err, next);
    if (handled) return res.status(handled.status).json({ message: handled.message });
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) { next(err); }
}

export async function deleteCategory(req, res, next) {
  try {
    const children = await Category.findOne({ parentId: req.params.id }).lean();
    if (children) return res.status(400).json({ message: 'Category has children' });
    const category = await Category.findByIdAndDelete(req.params.id).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json(orders);
  } catch (err) { next(err); }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
}

export async function listPromoCodes(req, res, next) {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 }).lean();
    res.json(promos);
  } catch (err) { next(err); }
}

export async function createPromoCode(req, res, next) {
  try {
    const promo = await PromoCode.create(req.body);
    res.status(201).json(promo);
  } catch (err) {
    const handled = handleError(err, next);
    if (handled) return res.status(handled.status).json({ message: handled.message });
  }
}

export async function deletePromoCode(req, res, next) {
  try {
    const promo = await PromoCode.findByIdAndDelete(req.params.id).lean();
    if (!promo) return res.status(404).json({ message: 'Promo code not found' });
    res.json({ message: 'Promo code deleted' });
  } catch (err) { next(err); }
}
