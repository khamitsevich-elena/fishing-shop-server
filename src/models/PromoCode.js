import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount: { type: Number, required: true, min: 0, max: 100 },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usageCount: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

promoCodeSchema.methods.isValid = function () {
  if (!this.active) return false;
  if (this.expiresAt < new Date()) return false;
  if (this.usageLimit !== null && this.usageCount >= this.usageLimit) return false;
  return true;
};

export default mongoose.model('PromoCode', promoCodeSchema);
