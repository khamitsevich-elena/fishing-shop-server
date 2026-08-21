import { Router } from 'express';
import { apply } from '../controllers/promo.controller.js';

const router = Router();

router.post('/apply', apply);

export default router;
