import mongoose from 'mongoose';
import Cart from '../models/cart.js';
import Product from '../models/products.js';

// A guest cart is matched using the ID that the React app sends in a header.
function getGuestToken(req) {
  const token = req.get('x-guest-cart-token') || '';
  if (token.length < 20 || token.length > 128) return '';
  return token;
}

// Find this user's cart, or this guest's cart.
async function findCart(req, createIfMissing = false) {
  let search;
  let newCart;

  if (req.user) {
    search = { userId: req.user._id };
    newCart = { userId: req.user._id, items: [] };
  } else {
    const guestToken = getGuestToken(req);
    if (!guestToken) return null;
    search = { guestToken };
    newCart = { guestToken, items: [] };
  }

  let cart = await Cart.findOne(search);
  if (!cart && createIfMissing) {
    cart = await Cart.create(newCart);
  }
  return cart;
}

// Add product details to cart items so the frontend can display them.
async function formatCart(cart) {
  if (!cart || cart.items.length === 0) return { cartItems: [] };

  const cartItems = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    cartItems.push({
      id: product._id.toString(),
      name: product.name,
      title: product.name,
      price: product.price,
      image: product.image || '',
      description: product.description,
      categoryId: product.categoryId.toString(),
      quantity: item.qty,
      stock: product.quantity,
    });
  }
  return { cartItems };
}

export async function getCart(req, res) {
  const cart = await findCart(req);
  return res.json(await formatCart(cart));
}

export async function addCartItem(req, res) {
  const productId = req.body.productId;
  const quantity = Number(req.body.quantity || 1);

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return res.status(400).json({ message: 'Quantity must be between 1 and 99.' });
  }

  const product = await Product.findOne({ _id: productId, status: 'active' });
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const cart = await findCart(req, true);
  if (!cart) return res.status(400).json({ message: 'A guest cart ID is required.' });

  const oldItem = cart.items.find((item) => item.productId === productId);
  const newQuantity = (oldItem ? oldItem.qty : 0) + quantity;
  if (newQuantity > product.quantity || newQuantity > 99) {
    return res.status(400).json({ message: 'There is not enough stock for that quantity.' });
  }

  if (oldItem) oldItem.qty = newQuantity;
  else cart.items.push({ productId, qty: quantity });

  await cart.save();
  return res.json(await formatCart(cart));
}

export async function setCartItemQuantity(req, res) {
  const productId = req.params.productId;
  const quantity = Number(req.body.quantity);

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return res.status(400).json({ message: 'Quantity must be between 1 and 99.' });
  }

  const product = await Product.findOne({ _id: productId, status: 'active' });
  if (!product || product.quantity < quantity) {
    return res.status(400).json({ message: 'There is not enough stock.' });
  }

  const cart = await findCart(req);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });
  const item = cart.items.find((cartItem) => cartItem.productId === productId);
  if (!item) return res.status(404).json({ message: 'Item not found.' });

  item.qty = quantity;
  await cart.save();
  return res.json(await formatCart(cart));
}

export async function removeCartItem(req, res) {
  const cart = await findCart(req);
  if (!cart) return res.json({ cartItems: [] });

  cart.items = cart.items.filter((item) => item.productId !== req.params.productId);
  await cart.save();
  return res.json(await formatCart(cart));
}

export async function clearCart(req, res) {
  const cart = await findCart(req);
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return res.json({ cartItems: [] });
}

// After login, move the guest's cart items into the user's cart.
export async function mergeGuestCart(req, res) {
  const guestToken = getGuestToken(req);
  if (!guestToken) return res.json({ cartItems: [] });

  const guestCart = await Cart.findOne({ guestToken });
  const userCart = await findCart(req, true);
  if (!guestCart) return res.json(await formatCart(userCart));

  for (const guestItem of guestCart.items) {
    const product = await Product.findOne({ _id: guestItem.productId, status: 'active' });
    if (!product || product.quantity < 1) continue;

    const userItem = userCart.items.find((item) => item.productId === guestItem.productId);
    const oldQuantity = userItem ? userItem.qty : 0;
    const newQuantity = Math.min(99, product.quantity, oldQuantity + guestItem.qty);

    if (userItem) userItem.qty = newQuantity;
    else userCart.items.push({ productId: guestItem.productId, qty: newQuantity });
  }

  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });
  return res.json(await formatCart(userCart));
}
