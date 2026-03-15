import { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { verifyToken } from '../utils/jwt.js'

/**
 * [STRIDE: S/E] [OWASP: A01:2025 Broken Access Control]
 * Extracts userId exclusively from the verified JWT — never from req.body or req.query.
 * This prevents an attacker from supplying their own userId to impersonate another user.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = verifyToken(token)
    req.user = { userId: payload.userId, role: payload.role as Role }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
