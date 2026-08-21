import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  house: { type: String, required: true },
  apt: { type: String, default: '' },
  note: { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  addresses: [addressSchema],
  refreshToken: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
