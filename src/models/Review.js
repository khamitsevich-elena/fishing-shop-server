import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, default: '' },
}, { timestamps: true });

reviewSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);
