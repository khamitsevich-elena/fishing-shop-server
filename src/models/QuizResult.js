import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: mongoose.Schema.Types.Mixed, required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  total: { type: Number, default: 0 },
}, { timestamps: true });

quizResultSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('QuizResult', quizResultSchema);
