import { Router } from 'express';
import { getTree } from '../controllers/category.controller.js';
import { cache } from '../middleware/cache.js';

const router = Router();

router.get('/', cache(300), getTree);

export default router;
