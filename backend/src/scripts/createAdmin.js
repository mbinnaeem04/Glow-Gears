import dotenv from 'dotenv';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.js';

dotenv.config();

const terminal = readline.createInterface({ input, output });

try {
  const email = (await terminal.question('Admin email: ')).trim().toLowerCase();
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  await connectDB();
  let user = await User.findOne({ email });

  if (user) {
    // Promote this account without changing its existing password.
    user.role = 'admin';
    user.status = 'active';
    await user.save();
    console.log('This account is now an admin. Sign in with its existing password.');
  } else {
    const password = await terminal.question('Create a password (at least 8 characters): ');
    if (password.length < 8) {
      throw new Error('The password must be at least 8 characters long.');
    }

    await User.create({ name: 'GlowGears Admin', email, password, role: 'admin' });
    console.log('Admin account created. You can now sign in.');
  }
} catch (error) {
  console.log('Could not create the admin account:', error.message);
  process.exitCode = 1;
} finally {
  terminal.close();
  await mongoose.disconnect();
}
