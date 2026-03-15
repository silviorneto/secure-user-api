import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../utils/asyncHandler.js'

const prisma = new PrismaClient()

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control]
 * Admin-only endpoint. RBAC is enforced at the route level via requireRole('ADMIN').
 * passwordHash is excluded from all user records returned.
 */
export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  res.status(200).json(users)
})
