import { Router } from 'express'
import { listUsers } from '../controllers/admin.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { Role } from '@prisma/client'

export const adminRouter = Router()

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control]
 * Double guard: authMiddleware verifies JWT, requireRole('ADMIN') checks role.
 * Both must pass — authentication and authorisation are separate steps.
 */
adminRouter.get('/users', authMiddleware, requireRole(Role.ADMIN), listUsers)
