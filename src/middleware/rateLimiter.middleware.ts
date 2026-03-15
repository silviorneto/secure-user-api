/**
 * [STRIDE: D] [OWASP: A04:2025 Insecure Design — defensive design]
 * Three separate rate limiters:
 * - global: 100 requests per 15 minutes (all routes)
 * - login: 10 requests per 15 minutes (brute-force protection)
 * - register: 5 requests per 15 minutes (account creation abuse)
 */
import rateLimit from 'express-rate-limit'

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export const globalLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

export const loginLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
})

export const registerLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many registration attempts, please try again later.' },
})
