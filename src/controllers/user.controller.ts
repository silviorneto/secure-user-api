import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../utils/asyncHandler.js'

const prisma = new PrismaClient()

/**
 * [STRIDE: I] [OWASP: A01:2025 Broken Access Control]
 * passwordHash is omitted at the ORM level — the hash never travels over the wire.
 */
const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
}

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control]
 * IDOR prevention: userId is sourced exclusively from the verified JWT (req.user),
 * never from req.params or req.body. A user can only access their own profile.
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SAFE_SELECT,
  })
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  res.status(200).json(user)
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  /**
   * [STRIDE: E] [OWASP: A01:2025 Broken Access Control]
   * IDOR prevention on PUT: same ownership guarantee — userId from JWT only.
   */
  const userId = req.user!.userId
  const data = req.body as { name?: string; email?: string }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: USER_SAFE_SELECT,
  })
  res.status(200).json(user)
})
