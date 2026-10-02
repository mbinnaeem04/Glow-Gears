import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Category from '../models/categories.js';
import Product from '../models/products.js';

dotenv.config();
const assetBase = String(process.env.PUBLIC_ASSET_URL || '').replace(/\/$/, '');
const image = (name) => `${assetBase}/images/${name}`;
const categoryData = [
  { name: 'Headphones', slug: 'headphones', description: 'Find your focus with rich, immersive sound.', image: image('Headphones.jpg'), sortOrder: 1 },
  { name: 'Mobiles', slug: 'mobiles', description: 'Everyday communication, with a little more magic.', image: image('Mobile.jpg'), sortOrder: 2 },
  { name: 'Laptops', slug: 'laptops', description: 'Portable power for projects big and small.', image: image('Laptops.jfif'), sortOrder: 3 },
  { name: 'Keyboards', slug: 'keyboards', description: 'Find a better rhythm for your desk.', image: image('Keyboards.jpg'), sortOrder: 4 },
];

const productData = [
  { name: 'Studio wireless headphones', slug: 'studio-wireless-headphones', sku: 'GG-HEAD-001', price: 99.99, description: 'Immersive, balanced sound for your everyday.', categorySlug: 'headphones', image: image('Headphones.jpg'), featured: true },
  { name: 'Pulse gaming headset', slug: 'pulse-gaming-headset', sku: 'GG-HEAD-002', price: 129.99, description: 'Comfortable over-ear sound with a little extra punch.', categorySlug: 'headphones', image: image('Headphones.jpg'), featured: true },
  { name: 'Everyday 5G smartphone', slug: 'everyday-5g-smartphone', sku: 'GG-MOB-001', price: 199.99, description: 'A capable companion for life on the move.', categorySlug: 'mobiles', image: image('Mobile.jpg'), featured: true },
  { name: 'Pocket Pro mobile', slug: 'pocket-pro-mobile', sku: 'GG-MOB-002', price: 349.99, description: 'A bright screen and all-day battery in your pocket.', categorySlug: 'mobiles', image: image('Mobile.jpg'), featured: false },
  { name: 'Ultralight performance laptop', slug: 'ultralight-performance-laptop', sku: 'GG-LAP-001', price: 779.99, description: 'A little more power for your big ideas.', categorySlug: 'laptops', image: image('Laptops.jfif'), featured: true },
  { name: 'Creator 14 laptop', slug: 'creator-14-laptop', sku: 'GG-LAP-002', price: 999.99, description: 'Room for your best work, wherever you go.', categorySlug: 'laptops', image: image('Laptops.jfif'), featured: false },
  { name: 'Mechanical keyboard', slug: 'mechanical-keyboard', sku: 'GG-KEY-001', price: 49.99, description: 'A satisfying click for every kind of work.', categorySlug: 'keyboards', image: image('Keyboards.jpg'), featured: true },
  { name: 'Compact RGB keyboard', slug: 'compact-rgb-keyboard', sku: 'GG-KEY-002', price: 69.99, description: 'Make your desk yours with a compact, colorful layout.', categorySlug: 'keyboards', image: image('Keyboards.jpg'), featured: false },
];

try {
  await connectDB();
  const categoryIds = new Map();
  for (const data of categoryData) {
    const category = await Category.findOneAndUpdate(
      { slug: data.slug },
      { $set: { ...data, status: 'active' } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    categoryIds.set(data.slug, category._id.toString());
  }

  for (const data of productData) {
    const { categorySlug, ...product } = data;
    await Product.findOneAndUpdate(
      { slug: product.slug },
      { $set: { ...product, categoryId: categoryIds.get(categorySlug), currency: 'USD', quantity: 100, status: 'active', price_range: 0 } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }
  console.log(`Seeded ${categoryData.length} categories and ${productData.length} products.`);
} catch (error) {
  console.error('Catalog seeding failed:', error.message);
  process.exitCode = 1;
} finally {
  const mongoose = (await import('mongoose')).default;
  await mongoose.disconnect();
}
