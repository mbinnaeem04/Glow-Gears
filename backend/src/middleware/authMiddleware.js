import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const getToken = (req) => {
  const authorization = req.headers.authorization || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
};

export const protect = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('name email role status');
    if (!user || user.status !== 'active') return res.status(401).json({ message: 'Please sign in to continue.' });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' });
  }
};

export const optionalProtect = async (req, _res, next) => {
  const token = getToken(req);
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('name email role status');
  } catch { req.user = null; }
  if (req.user?.status !== 'active') req.user = null;
  return next();
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Administrator access is required.' });
  }
  return next();
};
