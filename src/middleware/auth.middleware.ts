import { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { verifyToken } from '../utils/jwt.js'

/**
 * [STRIDE: S/E] [OWASP: A01:2025 Broken Access Control] [Endereça: T12]
 * O userId é extraído exclusivamente do JWT verificado, nunca de req.body ou req.query.
 * Impede que um atacante forneça o seu próprio userId para se fazer passar por outro utilizador.
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
    const role = payload.role as Role
    // Validação em runtime: rejeita tokens cujo campo role não seja um valor válido do enum Role.
    if (!Object.values(Role).includes(role)) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }
    req.user = { userId: payload.userId, role }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
