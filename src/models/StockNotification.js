import mongoose from 'mongoose';

const stockNotificationSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  notified: { type: Boolean, default: false },
}, { timestamps: true });

stockNotificationSchema.index({ email: 1, productId: 1 }, { unique: true });

export default mongoose.model('StockNotification', stockNotificationSchema);
