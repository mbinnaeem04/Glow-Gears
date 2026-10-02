import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Add MONGODB_URI to backend/.env first.');
  await mongoose.connect(uri);
  console.log('MongoDB connected.');
};

export default connectDB;
