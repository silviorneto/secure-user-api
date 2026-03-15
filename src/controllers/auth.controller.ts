import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import { signToken } from '../utils/jwt.js'
import { logLoginAttempt } from '../utils/logger.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const prisma = new PrismaClient()

/**
 * [STRIDE: I] [OWASP: A07:2025 Identification and Authentication Failures]
 * Returns HTTP 201 with an identical body whether registration succeeds or the email
 * already exists. This prevents user enumeration via differing responses.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string }

  /**
   * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures]
   * bcrypt cost factor 12 is applied before storing. Plain password is never persisted.
   */
  const passwordHash = await hashPassword(password)

  try {
    await prisma.user.create({ data: { name, email, passwordHash } })
  } catch {
    // Silently ignore duplicate email — same response as success (enumeration prevention)
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
   * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures]
   * JWT signed with server secret, expires in 15 minutes.
   */
  const token = signToken({ userId: user.id, role: user.role })
  res.status(200).json({ token })
})
