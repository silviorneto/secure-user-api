import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

/**
 * [STRIDE: I] [OWASP: A05:2025 Security Misconfiguration] [Endereça: T08]
 * Handler centralizado de erros. Stack traces e detalhes internos são registados no servidor
 * mas nunca enviados ao cliente, previne a divulgação de informação via erros verbosos.
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
