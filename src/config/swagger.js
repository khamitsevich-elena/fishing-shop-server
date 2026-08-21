import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FishingShop API',
      version: '1.0.0',
      description: 'Документация API интернет-магазина FishingShop',
    },
    servers: [
      { url: '/api', description: 'API сервер' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите токен в формате: Bearer <token>',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            oldPrice: { type: 'number' },
            brand: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            stock: { type: 'integer' },
            popularity: { type: 'integer' },
            fishTags: { type: 'array', items: { type: 'string' } },
            methodTags: { type: 'array', items: { type: 'string' } },
            seasonTags: { type: 'array', items: { type: 'string' } },
            specs: { type: 'object' },
            categoryId: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));
}
