import express from 'express';
import { archiveProduct, createProduct, getProductById, listProducts, updateProduct } from '../controllers/productController.js';
import { optionalProtect, protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', optionalProtect, listProducts);
router.get('/:id', optionalProtect, getProductById);
router.post('/', protect, requireAdmin, createProduct);
router.patch('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, archiveProduct);

export default router;
