import { Router } from 'express';
import { create, list, getById } from '../controllers/order.controller.js';
import { authRequired } from '../middleware/auth.js';
import { validate, orderValidators } from '../middleware/validate.js';

const router = Router();

router.use(authRequired);

router.post('/', orderValidators.create, validate, create);
router.get('/', list);
router.get('/:id', getById);

export default router;
