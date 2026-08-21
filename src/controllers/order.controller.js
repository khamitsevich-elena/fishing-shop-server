import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PromoCode from '../models/PromoCode.js';

export async function create(req, res, next) {
  try {
    const { items, delivery, paymentMethod, promoCode: promoCodeInput } = req.body;

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const priceMap = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = [];
    for (const i of items) {
      const p = priceMap.get(i.productId);
      if (!p) throw Object.assign(new Error(`Product ${i.productId} not found`), { status: 404 });
      if (p.stock < i.qty) {
        throw Object.assign(
          new Error(`Недостаточно товара "${p.name}". В наличии: ${p.stock}`),
          { status: 400 },
        );
      }
      orderItems.push({ productId: i.productId, name: p.name, price: p.price, qty: i.qty });
    }

    for (const i of items) {
      const p = priceMap.get(i.productId);
      p.stock -= i.qty;
      await p.save();
    }

    const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const deliveryCost = delivery.method === 'courier' ? 300 : 0;
    let subtotal = itemsTotal + deliveryCost;
    let discount = 0;
    let appliedPromo = '';

    if (promoCodeInput) {
      const promo = await PromoCode.findOne({ code: promoCodeInput.toUpperCase() });
      if (promo && promo.isValid() && subtotal >= promo.minOrderAmount) {
        discount = (subtotal * promo.discount) / 100;
        appliedPromo = promo.code;
        promo.usageCount += 1;
        await promo.save();
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totals: { items: itemsTotal, delivery: deliveryCost, discount, total: subtotal - discount },
      promoCode: appliedPromo,
      delivery: { method: delivery.method, address: delivery.address || '' },
      paymentMethod: paymentMethod || 'cash',
    });

    res.status(201).json(order);
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
}
