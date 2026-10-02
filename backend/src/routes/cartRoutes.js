import express from 'express';
import { addCartItem, clearCart, getCart, mergeGuestCart, removeCartItem, setCartItemQuantity } from '../controllers/cartController.js';
import { optionalProtect, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(optionalProtect);
router.get('/', getCart);
router.post('/items', addCartItem);
router.patch('/items/:productId', setCartItemQuantity);
router.delete('/items/:productId', removeCartItem);
router.delete('/', clearCart);
router.post('/merge', protect, mergeGuestCart);

export default router;
