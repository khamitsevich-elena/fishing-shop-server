import { Router } from 'express';
import { myReviews } from '../controllers/review.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/my', authRequired, myReviews);

export default router;
