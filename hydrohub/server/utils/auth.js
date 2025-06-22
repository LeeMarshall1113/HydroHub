import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export function hashPassword(pwd) {
  return bcrypt.hash(pwd, 10);
}

export function comparePassword(pwd, hash) {
  return bcrypt.compare(pwd, hash);
}

export function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);
  const token = header.split(' ')[1];
  try {
    req.user = verify(token);
    next();
  } catch (e) {
    res.sendStatus(401);
  }
}
