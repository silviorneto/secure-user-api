import { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * [STRIDE: I] [OWASP: A01:2025 Broken Access Control] [Endereça: T07]
 * O passwordHash é omitido ao nível do ORM — o hash nunca viaja na rede.
 */
export const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
}

/**
 * [STRIDE: E] [OWASP: A01:2025 Broken Access Control] [Endereça: T12]
 * Prevenção de IDOR: o userId é obtido exclusivamente do JWT verificado (req.user),
 * nunca de req.params ou req.body. Um utilizador só consegue aceder ao seu próprio perfil.
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
   * [STRIDE: E] [OWASP: A01:2025 Broken Access Control] [Endereça: T12]
   * Prevenção de IDOR no PUT: mesma garantia de ownership — userId exclusivamente do JWT.
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
