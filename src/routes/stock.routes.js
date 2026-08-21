import { Router } from 'express';
import { subscribe, list } from '../controllers/stock.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/subscribe', subscribe);
router.get('/subscriptions', authRequired, list);

export default router;
