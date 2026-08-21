import { Router } from 'express';
import { list, toggle, remove } from '../controllers/favorite.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);

router.get('/', list);
router.put('/:productId', toggle);
router.delete('/:productId', remove);

export default router;
