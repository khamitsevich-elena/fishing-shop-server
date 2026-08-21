import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.js';
import { validate, authValidators } from '../middleware/validate.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *                 refreshToken: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id: { type: string }
 *                     email: { type: string }
 *                     name: { type: string }
 *                     role: { type: string }
 */
router.post('/register', authValidators.register, validate, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход в аккаунт
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *                 refreshToken: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id: { type: string }
 *                     email: { type: string }
 *                     name: { type: string }
 *                     role: { type: string }
 */
router.post('/login', authValidators.login, validate, login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Обновление access-токена
 *     responses:
 *       200:
 *         description: Новый access-токен
 */
router.post('/refresh', refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Выход из аккаунта
 *     responses:
 *       200:
 *         description: Успешный выход
 */
router.post('/logout', logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Данные текущего пользователя
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Данные пользователя
 */
router.get('/me', authRequired, me);

export default router;
