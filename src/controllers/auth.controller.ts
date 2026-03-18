import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import { signToken } from '../utils/jwt.js'
import { logLoginAttempt } from '../utils/logger.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * [STRIDE: I] [OWASP: A07:2025 Identification and Authentication Failures] [Endereça: T02]
 * Devolve HTTP 201 com um corpo idêntico quer o registo seja bem-sucedido quer o email
 * já exista. Impede a enumeração de contas via respostas diferenciadas.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string }

  /**
   * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures] [Endereça: T01]
   * bcrypt com cost factor 12 é aplicado antes de armazenar. A password nunca é persistida em claro.
   */
  const passwordHash = await hashPassword(password)

  try {
    await prisma.user.create({ data: { name, email, passwordHash } })
  } catch (err) {
    // Apenas ignora violações de restrição única (email duplicado).
    // Todos os outros erros (falhas de ligação, etc.) são relançados para que
    // o handler centralizado devolva 500 em vez de um 201 enganoso.
    if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) {
      throw err
    }
  }

  res.status(201).json({ message: 'If this email is not registered, your account has been created.' })
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string }
  const ip = req.ip ?? 'unknown'

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    logLoginAttempt(email, ip, false)
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = await comparePassword(password, user.passwordHash)
  logLoginAttempt(email, ip, valid)

  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  /**
   * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures] [Endereça: T03, T15]
   * JWT assinado com o segredo do servidor, expira em 15 minutos.
   */
  const token = signToken({ userId: user.id, role: user.role })
  res.status(200).json({ token })
})
