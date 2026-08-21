import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import { authRequired } from '../middleware/auth.js';
import { adminRequired } from '../middleware/admin.js';

const router = Router();

router.use(authRequired, adminRequired);

router.get('/products', admin.listProducts);
router.post('/products', admin.createProduct);
router.put('/products/:id', admin.updateProduct);
router.delete('/products/:id', admin.deleteProduct);

router.get('/categories', admin.listCategories);
router.post('/categories', admin.createCategory);
router.put('/categories/:id', admin.updateCategory);
router.delete('/categories/:id', admin.deleteCategory);

router.get('/orders', admin.listOrders);
router.put('/orders/:id/status', admin.updateOrderStatus);

router.get('/promo', admin.listPromoCodes);
router.post('/promo', admin.createPromoCode);
router.delete('/promo/:id', admin.deletePromoCode);

export default router;
