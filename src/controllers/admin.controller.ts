import { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { USER_SAFE_SELECT } from './user.controller.js'

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control] [Endereça: T13]
 * Endpoint exclusivo para administradores. O RBAC é aplicado ao nível da rota via requireRole('ADMIN').
 * O passwordHash é excluído de todos os registos devolvidos.
 */
export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: USER_SAFE_SELECT,
    orderBy: { createdAt: 'desc' },
  })
  res.status(200).json(users)
})
