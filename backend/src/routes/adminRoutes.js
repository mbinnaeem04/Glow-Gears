import express from 'express';
import { archiveCategory, createCategory, listCategories, updateCategory } from '../controllers/categoryController.js';
import { archiveProduct, createProduct, listProducts, updateProduct } from '../controllers/productController.js';
import { listAllOrders, updateOrderFulfillment } from '../controllers/orderController.js';

const router = express.Router();
router.get('/categories', listCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', archiveCategory);
router.get('/products', listProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', archiveProduct);
router.get('/orders', listAllOrders);
router.patch('/orders/:id/fulfillment', updateOrderFulfillment);

export default router;
