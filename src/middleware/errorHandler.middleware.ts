import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

/**
 * [STRIDE: I] [OWASP: A05:2025 Security Misconfiguration]
 * Centralised error handler. Stack traces and internal details are logged server-side
 * but never sent to the client — prevents information disclosure via verbose errors.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error('unhandled_error', { message: err.message, stack: err.stack })
  res.status(500).json({ error: 'Internal server error' })
}
