import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authroute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { protect, requireAdmin } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Simple health check URLs.
app.get('/health/live', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/ready', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({ connected: isConnected });
});


app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


app.use('/api/admin', protect, requireAdmin, adminRoutes);


app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});


app.use((error, req, res, next) => {
  console.error(error.message);
  const status = error.statusCode || error.status || 500;
  const message = error.code === 11000 ? 'That value is already being used.' : error.message;
  res.status(status).json({ message: status === 500 ? 'Something went wrong on the server.' : message });
});

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('Add JWT_SECRET to backend/.env first.');
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log(`GlowGears API is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Could not connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
