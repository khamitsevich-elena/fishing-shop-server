import PromoCode from '../models/PromoCode.js';

export async function apply(req, res, next) {
  try {
    const { code, total } = req.body;
    const promo = await PromoCode.findOne({ code: code?.toUpperCase() });

    if (!promo) return res.status(404).json({ message: 'Промокод не найден' });
    if (!promo.isValid()) return res.status(400).json({ message: 'Промокод недействителен или истёк' });
    if (Number(total) < promo.minOrderAmount) {
      return res.status(400).json({ message: `Минимальная сумма заказа: ${promo.minOrderAmount} ₽` });
    }

    const discountAmount = (Number(total) * promo.discount) / 100;
    res.json({
      code: promo.code,
      discount: promo.discount,
      discountAmount,
      newTotal: Number(total) - discountAmount,
    });
  } catch (err) { next(err); }
}
