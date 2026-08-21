import { Router } from 'express';
import { getCart, updateCart } from '../controllers/cart.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.get('/', getCart);
router.put('/', updateCart);

export default router;
