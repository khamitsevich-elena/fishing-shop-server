import { Router } from 'express';
import { list, create } from '../controllers/review.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/', list);
router.post('/', authRequired, create);

export default router;
