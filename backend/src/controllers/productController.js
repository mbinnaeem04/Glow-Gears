import mongoose from 'mongoose';
import Category from '../models/categories.js';
import Product from '../models/products.js';

const serialize = (product) => ({
  id: product._id.toString(),
  name: product.name,
  slug: product.slug,
  sku: product.sku || '',
  price: Number(product.price),
  description: product.description,
  categoryId: String(product.categoryId),
  image: product.image || '',
  price_range: Number(product.price_range) || 0,
  currency: product.currency || 'USD',
  quantity: Number(product.quantity) || 0,
  status: product.status,
  featured: Boolean(product.featured),
});

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isSafeImage = (value) => {
  if (!value) return true;
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};

export const listProducts = async (req, res) => {
  const includeArchived = req.query.all === 'true';
  if (includeArchived && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Administrator access is required.' });
  }
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 100));
  const filter = includeArchived ? {} : { status: 'active' };

  if (req.query.categoryId) {
    if (!mongoose.isValidObjectId(String(req.query.categoryId))) return res.status(400).json({ message: 'Invalid category ID.' });
    filter.categoryId = String(req.query.categoryId);
  }
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.q) {
    const query = String(req.query.q).trim().slice(0, 80);
    if (query) {
      const pattern = new RegExp(escapeRegExp(query), 'i');
      filter.$or = [{ name: pattern }, { description: pattern }, { sku: pattern }];
    }
  }

  const sortMap = {
    featured: { featured: -1, createdAt: -1 },
    'price-low': { price: 1, name: 1 },
    'price-high': { price: -1, name: 1 },
    name: { name: 1 },
    newest: { createdAt: -1 },
  };
  const sort = sortMap[String(req.query.sort || 'featured')] || sortMap.featured;
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return res.json({ products: products.map(serialize), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

export const getProductById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
  const filter = { _id: req.params.id };
  if (req.user?.role !== 'admin') filter.status = 'active';
  const product = await Product.findOne(filter).lean();
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ product: serialize(product) });
};

export const createProduct = async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const description = String(req.body?.description || '').trim();
  const image = String(req.body?.image || '').trim();
  const categoryId = String(req.body?.categoryId || '').trim();
  const price = Number(req.body?.price);
  const quantity = Number(req.body?.quantity ?? 0);
  if (name.length < 2 || name.length > 160) return res.status(400).json({ message: 'Product name must be between 2 and 160 characters.' });
  if (!description || description.length > 5000) return res.status(400).json({ message: 'Enter a product description of at most 5000 characters.' });
  if (!Number.isFinite(price) || price <= 0 || price > 10000000) return res.status(400).json({ message: 'Enter a valid product price.' });
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 1000000) return res.status(400).json({ message: 'Stock quantity must be a non-negative whole number.' });
  if (!mongoose.isValidObjectId(categoryId) || !(await Category.exists({ _id: categoryId, status: 'active' }))) return res.status(400).json({ message: 'Choose an active category.' });
  if (image.length > 1000 || !isSafeImage(image)) return res.status(400).json({ message: 'Use an HTTPS image URL or a root-relative image path.' });

  const product = await Product.create({
    name, description, image, categoryId, price: Math.round(price * 100) / 100,
    quantity, currency: String(req.body?.currency || 'USD').toUpperCase(),
    featured: req.body?.featured === true,
    sku: String(req.body?.sku || '').trim() || undefined,
    slug: String(req.body?.slug || '').trim(),
    status: 'active',
  });
  return res.status(201).json({ product: serialize(product) });
};

export const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const body = req.body || {};
  const allowed = ['name', 'slug', 'sku', 'description', 'image', 'categoryId', 'price', 'quantity', 'currency', 'featured'];
  for (const key of allowed) {
    if (!Object.hasOwn(body, key)) continue;
    if (key === 'name' || key === 'description' || key === 'image' || key === 'slug' || key === 'sku') {
      product[key] = String(body[key] || '').trim();
    } else if (key === 'price') {
      const value = Number(body.price);
      if (!Number.isFinite(value) || value <= 0 || value > 10000000) return res.status(400).json({ message: 'Enter a valid product price.' });
      product.price = Math.round(value * 100) / 100;
    } else if (key === 'quantity') {
      const value = Number(body.quantity);
      if (!Number.isInteger(value) || value < 0 || value > 1000000) return res.status(400).json({ message: 'Stock quantity must be a non-negative whole number.' });
      product.quantity = value;
    } else if (key === 'categoryId') {
      const value = String(body.categoryId);
      if (!mongoose.isValidObjectId(value) || !(await Category.exists({ _id: value, status: 'active' }))) return res.status(400).json({ message: 'Choose an active category.' });
      product.categoryId = value;
    } else if (key === 'currency') {
      product.currency = String(body.currency).toUpperCase();
    } else if (key === 'featured') {
      if (typeof body.featured !== 'boolean') return res.status(400).json({ message: 'Featured must be true or false.' });
      product.featured = body.featured;
    }
  }
  if (product.name.length < 2 || product.description.length === 0 || product.image.length > 1000 || !isSafeImage(product.image)) return res.status(400).json({ message: 'Check the product name, description, and image URL.' });
  await product.save();
  return res.json({ product: serialize(product) });
};

export const archiveProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
  const product = await Product.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ product: serialize(product), message: 'Product archived.' });
};
