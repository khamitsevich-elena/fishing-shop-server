import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

function signTokens(userId) {
  const accessToken = jwt.sign({ sub: userId }, env.jwt.secret, { expiresIn: env.jwt.accessExpires });
  const refreshToken = jwt.sign({ sub: userId }, env.jwt.secret, { expiresIn: env.jwt.refreshExpires });
  return { accessToken, refreshToken };
}

async function signAndSave(userId) {
  const tokens = signTokens(userId);
  await User.findByIdAndUpdate(userId, { refreshToken: tokens.refreshToken });
  return tokens;
}

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });

    const tokens = await signAndSave(user._id);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, ...tokens });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const tokens = await signAndSave(user._id);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'lax' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, ...tokens });
  } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findById(payload.sub);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const tokens = await signAndSave(user._id);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'lax' });
    res.json(tokens);
  } catch {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

export async function logout(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(header.slice(7), env.jwt.secret);
        await User.findByIdAndUpdate(payload.sub, { refreshToken: '' });
      } catch { /* token expired — session already dead */ }
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'ok' });
  } catch (err) { next(err); }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
