import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, sparse: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  customerEmail: { type: String, required: true, trim: true, lowercase: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1, max: 99 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },
  }],
  subtotal: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
  shippingAddress: {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    street: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    postalCode: { type: String, trim: true, maxlength: 30, default: '' },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
  },
  paymentMethod: { type: String, enum: ['cash_on_delivery'], default: 'cash_on_delivery' },
  fulfillmentStatus: { type: String, enum: ['unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'unfulfilled' },
}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ fulfillmentStatus: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
