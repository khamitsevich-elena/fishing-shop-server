import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';
import { requestLogger } from './middleware/requestLogger.js';
import { setupSwagger } from './config/swagger.js';

import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import cartRoutes from './routes/cart.routes.js';
import addressRoutes from './routes/address.routes.js';
import promoRoutes from './routes/promo.routes.js';
import reviewRoutes from './routes/review.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import stockRoutes from './routes/stock.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "blob:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Swagger UI — доступен если ENABLE_SWAGGER=true или в development
if (process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:slug/reviews', apiLimiter, reviewRoutes);
app.use('/api/reviews', apiLimiter, reviewsRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/favorites', apiLimiter, favoriteRoutes);
app.use('/api/quiz', apiLimiter, quizRoutes);
app.use('/api/cart', apiLimiter, cartRoutes);
app.use('/api/addresses', apiLimiter, addressRoutes);
app.use('/api/promo', apiLimiter, promoRoutes);
app.use('/api/stock', apiLimiter, stockRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

export default app;
