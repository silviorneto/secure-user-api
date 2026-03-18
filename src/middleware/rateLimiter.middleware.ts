/**
 * [STRIDE: D] [OWASP: A04:2025 Insecure Design] [Endereça: T01, T11]
 * Três rate limiters independentes:
 * - global: 100 pedidos por 15 minutos (todas as rotas)
 * - login: 10 pedidos por 15 minutos (protecção contra brute-force)
 * - register: 5 pedidos por 15 minutos (prevenção de abuso no registo de contas)
 */
import rateLimit from 'express-rate-limit'

const WINDOW_MS = 15 * 60 * 1000 // 15 minutos

function makeLimiter(max: number, message: string) {
  return rateLimit({
    windowMs: WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  })
}

export const globalLimiter = makeLimiter(100, 'Too many requests, please try again later.')
export const loginLimiter = makeLimiter(10, 'Too many login attempts, please try again later.')
export const registerLimiter = makeLimiter(5, 'Too many registration attempts, please try again later.')
