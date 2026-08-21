import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [itemSchema],
  totals: {
    items: { type: Number, required: true },
    delivery: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  promoCode: { type: String, default: '' },
  delivery: {
    method: { type: String, enum: ['courier', 'pickup', 'post'], required: true },
    address: { type: String, default: '' },
  },
  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  status: {
    type: String,
    enum: ['created', 'assembled', 'shipping', 'delivered', 'cancelled'],
    default: 'created',
  },
}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);
