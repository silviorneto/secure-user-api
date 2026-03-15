import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

/**
 * [STRIDE: T] [OWASP: A05:2025 Security Misconfiguration]
 * Factory that returns an Express middleware validating req.body against a Zod schema.
 * Returns 400 with field-level error details on failure, never passes invalid data downstream.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      res.status(400).json({ error: 'Validation failed', details: errors })
      return
    }
    req.body = result.data
    next()
  }
}
