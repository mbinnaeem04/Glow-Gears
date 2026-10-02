import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestToken: { type: String, default: null },
  items: [{
    productId: { type: String, required: true },
    qty: { type: Number, required: true, min: 1, max: 99 },
  }],
}, { timestamps: true });

cartSchema.index({ userId: 1 }, { unique: true, sparse: true });
cartSchema.index({ guestToken: 1 }, { unique: true, sparse: true });

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
