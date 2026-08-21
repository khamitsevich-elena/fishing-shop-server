import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  icon: { type: String, default: '' },
}, { timestamps: true });

categorySchema.index({ parentId: 1 });

export default mongoose.model('Category', categorySchema);
