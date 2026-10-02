import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/user.js';

// A token is returned after login. The frontend sends it with later requests.
const createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  displayName: user.name,
  email: user.email,
  role: user.role,
});

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const login = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');
  if (!validator.isEmail(email) || !password) {
    return res.status(400).json({ message: 'Enter a valid email and password.' });
  }

  const user = await User.findOne({ email }).select('+password');
  const validPassword = user ? await user.comparePassword(password) : false;
  if (!user || !validPassword || user.status !== 'active') {
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  }

  return res.json({ token: createToken(user._id.toString()), user: publicUser(user) });
};

export const signup = async (req, res) => {
  const name = String(req.body?.displayName ?? req.body?.name ?? '').trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    const user = await User.create({ name, email, password, role: 'customer' });
    return res.status(201).json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    throw error;
  }
};

export const getMe = (req, res) => res.json({ user: publicUser(req.user) });

export const updateMe = async (req, res) => {
  const name = String(req.body?.displayName ?? req.body?.name ?? '').trim();
  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
  }
  req.user.name = name;
  await req.user.save();
  return res.json({ user: publicUser(req.user) });
};
