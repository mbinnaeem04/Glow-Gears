import mongoose from 'mongoose';
import Category from '../models/categories.js';
import Product from '../models/products.js';

const slugify = (value) => String(value || '')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

const serialize = (category) => ({
  id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  description: category.description || '',
  image: category.image || '',
  status: category.status,
  sortOrder: category.sortOrder || 0,
});

const invalidId = (id) => !mongoose.isValidObjectId(id);
const isSafeImage = (value) => {
  if (!value) return true;
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};

export const listCategories = async (req, res) => {
  const includeArchived = req.query.all === 'true';
  if (includeArchived && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Administrator access is required.' });
  }
  const filter = includeArchived ? {} : { status: 'active' };
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
  return res.json({ categories: categories.map((category) => ({ ...serialize(category), id: category._id.toString() })) });
};

export const createCategory = async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const description = String(req.body?.description || '').trim();
  const image = String(req.body?.image || '').trim();
  if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Category name must be between 2 and 80 characters.' });
  if (description.length > 500) return res.status(400).json({ message: 'Category description is too long.' });
  if (image.length > 1000 || !isSafeImage(image)) return res.status(400).json({ message: 'Use an HTTPS image URL or a root-relative image path.' });
  const slug = slugify(req.body?.slug || name);
  if (!slug) return res.status(400).json({ message: 'Category name must contain letters or numbers.' });
  const category = await Category.create({ name, slug, description, image, sortOrder: Number(req.body?.sortOrder) || 0 });
  return res.status(201).json({ category: serialize(category) });
};

export const updateCategory = async (req, res) => {
  if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid category ID.' });
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });

  const allowed = ['name', 'description', 'image', 'sortOrder', 'slug'];
  for (const key of allowed) {
    if (!Object.hasOwn(req.body || {}, key)) continue;
    if (key === 'name') {
      const value = String(req.body.name).trim();
      if (value.length < 2 || value.length > 80) return res.status(400).json({ message: 'Category name must be between 2 and 80 characters.' });
      category.name = value;
    } else if (key === 'description') {
      const value = String(req.body.description || '').trim();
      if (value.length > 500) return res.status(400).json({ message: 'Category description is too long.' });
      category.description = value;
    } else if (key === 'image') {
      const value = String(req.body.image || '').trim();
      if (value.length > 1000 || !isSafeImage(value)) return res.status(400).json({ message: 'Use an HTTPS image URL or a root-relative image path.' });
      category.image = value;
    } else if (key === 'sortOrder') {
      const value = Number(req.body.sortOrder);
      if (!Number.isInteger(value) || value < 0 || value > 100000) return res.status(400).json({ message: 'Sort order must be a non-negative whole number.' });
      category.sortOrder = value;
    } else if (key === 'slug') {
      const value = slugify(req.body.slug);
      if (!value) return res.status(400).json({ message: 'Enter a valid category slug.' });
      category.slug = value;
    }
  }
  await category.save();
  return res.json({ category: serialize(category) });
};

export const archiveCategory = async (req, res) => {
  if (invalidId(req.params.id)) return res.status(400).json({ message: 'Invalid category ID.' });
  const category = await Category.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  await Product.updateMany({ categoryId: category._id.toString(), status: 'active' }, { status: 'archived' });
  return res.json({ category: serialize(category), message: 'Category archived.' });
};
