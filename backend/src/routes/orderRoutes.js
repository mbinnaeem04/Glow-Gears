import express from 'express';
import { createOrder, getMyOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/mine', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getMyOrder);

export default router;
