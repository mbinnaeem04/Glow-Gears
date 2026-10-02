import mongoose from 'mongoose';

const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 100);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 100 },
  sku: { type: String, trim: true, uppercase: true, sparse: true, unique: true, maxlength: 64 },
  price: { type: Number, required: true, min: 0.01, max: 10000000 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  categoryId: { type: String, required: true, index: true },
  image: { type: String, trim: true, default: '' },
  price_range: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'USD', uppercase: true, minlength: 3, maxlength: 3 },
  quantity: { type: Number, default: 0, min: 0, max: 1000000 },
  status: { type: String, enum: ['active', 'archived'], default: 'active', required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.pre('validate', function setSlug() {
  if (!this.slug && this.name) this.slug = slugify(this.name);
  if (this.slug) this.slug = slugify(this.slug);
});

productSchema.index({ categoryId: 1, status: 1, featured: -1, name: 1 });
productSchema.index({ featured: -1, status: 1, createdAt: -1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
