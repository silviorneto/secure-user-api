import { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control] [Endereça: T13]
 * Controlo de acesso baseado em papéis (RBAC). Verifica se req.user.role corresponde ao papel exigido.
 * Deve ser usado após o authMiddleware, depende de req.user estar definido.
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
