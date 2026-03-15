import { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control]
 * Role-based access control. Verifies req.user.role matches the required role.
 * Must be used after authMiddleware — depends on req.user being set.
 */
export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ error: 'Insufficient permissions' })
      return
    }
    next()
  }
}
