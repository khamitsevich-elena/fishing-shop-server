import redis from '../config/redis.js';

const DEFAULT_TTL = 60;

export function cache(ttl = DEFAULT_TTL) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        res.set('X-Cache', 'MISS');
        redis.setex(key, ttl, JSON.stringify(body)).catch(() => {});
        return originalJson(body);
      };
      next();
    } catch (err) {
      next();
    }
  };
}

export async function clearCache(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch { /* ignore */ }
}
