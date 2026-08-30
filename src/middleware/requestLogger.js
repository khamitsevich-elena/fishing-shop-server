import logger from '../config/logger.js';

export function requestLogger(req, res, next) {
  const start = Date.now();

  // Log the full URL including protocol and host
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: fullUrl,
      path: req.path,
      query: req.query,
      headers: {
        origin: req.headers.origin,
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
        'referer': req.headers.referer,
      },
      // Include request body for POST requests (limited to first 200 chars)
      body: req.method === 'POST' && req.body ? JSON.stringify(req.body).substring(0, 200) : undefined,
      status: res.statusCode,
      duration,
      ip: req.ip,
    });
  });

  next();
}
