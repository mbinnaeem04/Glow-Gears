import express from 'express';
import { getMe, login, signup, updateMe } from '../controllers/authControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/login', login);
router.post('/signup', signup);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

export default router;
