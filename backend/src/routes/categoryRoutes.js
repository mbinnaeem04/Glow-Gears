import express from 'express';
import { archiveCategory, createCategory, listCategories, updateCategory } from '../controllers/categoryController.js';
import { optionalProtect, protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', optionalProtect, listCategories);
router.post('/', protect, requireAdmin, createCategory);
router.patch('/:id', protect, requireAdmin, updateCategory);
router.delete('/:id', protect, requireAdmin, archiveCategory);

export default router;
