import { Router } from 'express'
import { listUsers } from '../controllers/admin.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { Role } from '@prisma/client'

export const adminRouter = Router()

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control] [Endereça: T13]
 * Dupla verificação: authMiddleware valida o JWT, requireRole('ADMIN') verifica o papel.
 * Ambos têm de passar, autenticação e autorização são etapas independentes.
 */
adminRouter.get('/users', authMiddleware, requireRole(Role.ADMIN), listUsers)
