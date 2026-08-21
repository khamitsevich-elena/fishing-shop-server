import { Router } from 'express';
import { list, getBySlug, similar } from '../controllers/product.controller.js';
import { cache } from '../middleware/cache.js';

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Список товаров с фильтрацией и пагинацией
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Поиск по названию
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Slug категории
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [popular, price_asc, price_desc, new]
 *         description: Сортировка
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Страница
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Лимит
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Фильтр по бренду
 *       - in: query
 *         name: fish
 *         schema:
 *           type: string
 *         description: Фильтр по рыбе
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: Фильтр по способу ловли
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         description: Фильтр по сезону
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Только в наличии
 *       - in: query
 *         name: hasDiscount
 *         schema:
 *           type: boolean
 *         description: Только со скидкой
 *       - in: query
 *         name: priceFrom
 *         schema:
 *           type: number
 *         description: Цена от
 *       - in: query
 *         name: priceTo
 *         schema:
 *           type: number
 *         description: Цена до
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 */
router.get('/', cache(60), list);

/**
 * @openapi
 * /products/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Товар по slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Данные товара
 *       404:
 *         description: Товар не найден
 */
router.get('/:slug', cache(300), getBySlug);

/**
 * @openapi
 * /products/{id}/similar:
 *   get:
 *     tags: [Products]
 *     summary: Похожие товары
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список похожих товаров
 */
router.get('/:id/similar', cache(300), similar);

export default router;
