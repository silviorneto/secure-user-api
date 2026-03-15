/**
 * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures]
 * JWT with 15-minute expiry limits the window of token abuse if intercepted.
 * Secret is loaded from .env — never hardcoded in source.
 */
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { config } from '../config/index.js'

export interface TokenPayload {
  userId: string
  role: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as string })
}

export function verifyToken(token: string): TokenPayload {
  // Runtime shape validation via Zod — prevents a valid but malformed JWT
  // from silently producing undefined on payload.userId or payload.role.
  const decoded = jwt.verify(token, config.jwtSecret)
  return z.object({ userId: z.string(), role: z.string() }).parse(decoded)
}
