import dotenv from 'dotenv';
dotenv.config();

export default {
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fishing-shop',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
};
