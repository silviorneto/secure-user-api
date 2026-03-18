/**
 * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures] [Endereça: T03, T15]
 * JWT com expiração de 15 minutos limita a janela de abuso do token em caso de intercepção.
 * O segredo é carregado do ficheiro .env, nunca escrito directamente no código fonte.
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

// Definido ao nível do módulo para que o objecto de schema não seja reconstruído a cada chamada.
const TokenPayloadSchema = z.object({ userId: z.string(), role: z.string() })

export function verifyToken(token: string): TokenPayload {
  // Validação de forma em runtime via Zod — impede que um JWT válido mas malformado
  // produza silenciosamente undefined em payload.userId ou payload.role.
  const decoded = jwt.verify(token, config.jwtSecret)
  return TokenPayloadSchema.parse(decoded)
}
