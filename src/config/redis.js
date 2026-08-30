import Redis from 'ioredis';

const MAX_CONNECT_ATTEMPTS = 10;

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  connectTimeout: 1000,
  // Без enableOfflineQueue:false команда, брошенная на недоступный Redis, ждёт
  // 20 переподключений (~70с) и только потом падает — это вешало каждый запрос.
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > MAX_CONNECT_ATTEMPTS) return null;
    return Math.min(times * 200, 2000);
  },
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

export function isRedisReady() {
  return redis.status === 'ready';
}

export default redis;
