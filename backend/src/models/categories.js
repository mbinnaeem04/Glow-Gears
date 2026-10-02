import mongoose from 'mongoose';

const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  image: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['active', 'archived'], default: 'active', index: true },
  sortOrder: { type: Number, default: 0, min: 0, max: 100000 },
}, { timestamps: true });

categorySchema.pre('validate', function setSlug() {
  if (!this.slug && this.name) this.slug = slugify(this.name);
  if (this.slug) this.slug = slugify(this.slug);
});

categorySchema.index({ status: 1, sortOrder: 1, name: 1 });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
