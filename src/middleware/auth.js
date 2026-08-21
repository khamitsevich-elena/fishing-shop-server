import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = header.slice(7);
    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), env.jwt.secret);
      req.userId = payload.sub;
    } catch { /* ignore */ }
  }
  next();
}
