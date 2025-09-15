import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);

    if (typeof decoded === 'string') {
      return res.status(403).json({ error: 'Invalid token format' });
    }

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && now >= decoded.exp) {
      return res.status(401).json({ error: 'Token expired' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

export default authMiddleware;
