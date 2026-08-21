import { Router } from 'express';
import { questions, match, save, results, remove } from '../controllers/quiz.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/questions', questions);
router.post('/match', match);
router.post('/save', authRequired, save);
router.get('/results', authRequired, results);
router.delete('/results/:id', authRequired, remove);

export default router;
