import mongoose from 'mongoose';
import Cart from '../models/cart.js';
import Order from '../models/orders.js';
import Product from '../models/products.js';

// Convert a MongoDB order into the object used by the React app.
function formatOrder(order) {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    userId: order.userId.toString(),
    customerEmail: order.customerEmail,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: item.qty,
      price: item.price,
      currency: item.currency,
    })),
    subtotal: order.subtotal,
    total: order.total,
    currency: order.currency,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    fulfillmentStatus: order.fulfillmentStatus,
    createdAt: order.createdAt,
  };
}

// Place an order from the signed-in customer's cart.
export async function createOrder(req, res) {
  const address = req.body.shippingAddress || {};
  if (!address.fullName || !address.street || !address.city || !address.country) {
    return res.status(400).json({ message: 'Enter your name, street, city, and country.' });
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty.' });
  }

  const orderItems = [];
  const stockUpdates = [];
  let subtotal = 0;

  // Check every product and make a snapshot of its name and price.
  for (const cartItem of cart.items) {
    const product = await Product.findOne({ _id: cartItem.productId, status: 'active' });
    if (!product) return res.status(400).json({ message: 'A product in your cart is unavailable.' });
    if (product.quantity < cartItem.qty) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
    }
    if (orderItems.length > 0 && orderItems[0].currency !== (product.currency || 'USD')) {
      return res.status(400).json({ message: 'All items in the cart must use the same currency.' });
    }

    orderItems.push({
      productId: product._id.toString(),
      name: product.name,
      image: product.image || '',
      qty: cartItem.qty,
      price: product.price,
      currency: product.currency || 'USD',
    });
    stockUpdates.push({ product, quantity: cartItem.qty });
    subtotal = Math.round((subtotal + product.price * cartItem.qty) * 100) / 100;
  }

  // Subtract the ordered quantities from inventory.
  for (const item of stockUpdates) {
    const result = await Product.updateOne(
      { _id: item.product._id, quantity: { $gte: item.quantity } },
      { $inc: { quantity: -item.quantity } },
    );
    if (result.modifiedCount !== 1) {
      return res.status(400).json({ message: 'The stock changed. Please refresh your cart and try again.' });
    }
  }

  // There is no online payment integration. Orders are cash on delivery.
  const order = new Order({
    userId: req.user._id,
    customerEmail: req.user.email,
    items: orderItems,
    subtotal,
    total: subtotal,
    currency: orderItems[0].currency,
    shippingAddress: address,
    paymentMethod: 'cash_on_delivery',
    fulfillmentStatus: 'unfulfilled',
  });
  order.orderNumber = `GG-${order._id.toString().slice(-8).toUpperCase()}`;
  await order.save();

  cart.items = [];
  await cart.save();

  return res.status(201).json({ order: formatOrder(order) });
}

// Show the signed-in customer's orders.
export async function getMyOrders(req, res) {
  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  return res.json({ orders: orders.map(formatOrder) });
}

// Show one order, but only when it belongs to the signed-in customer.
export async function getMyOrder(req, res) {
  const search = mongoose.isValidObjectId(req.params.id)
    ? { _id: req.params.id, userId: req.user._id }
    : { orderNumber: req.params.id, userId: req.user._id };
  const order = await Order.findOne(search);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  return res.json({ order: formatOrder(order) });
}

// Admin page: show recent orders.
export async function listAllOrders(req, res) {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
  return res.json({ orders: orders.map(formatOrder) });
}

// Admin page: change an order's delivery status.
export async function updateOrderFulfillment(req, res) {
  const allowedStatuses = ['unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'];
  const newStatus = req.body.fulfillmentStatus;
  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({ message: 'Choose a valid order status.' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  if (order.fulfillmentStatus === 'cancelled' && newStatus !== 'cancelled') {
    return res.status(400).json({ message: 'A cancelled order cannot be changed.' });
  }

  // If an order is cancelled, return its items to inventory.
  if (newStatus === 'cancelled' && order.fulfillmentStatus !== 'cancelled') {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.productId }, { $inc: { quantity: item.qty } });
    }
  }

  order.fulfillmentStatus = newStatus;
  await order.save();
  return res.json({ order: formatOrder(order) });
}
