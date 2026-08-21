import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: '' },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  images: [{ type: String }],
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  stock: { type: Number, default: 0 },
  fishTags: [{ type: String }],
  methodTags: [{ type: String }],
  seasonTags: [{ type: String }],
  popularity: { type: Number, default: 0 },
  description: { type: String, default: '' },
}, { timestamps: true });

productSchema.index({ categoryId: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ fishTags: 1 });
productSchema.index({ methodTags: 1 });
productSchema.index({ seasonTags: 1 });
productSchema.index({ price: 1 });
productSchema.index({ popularity: -1 });

export default mongoose.model('Product', productSchema);
