import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

/**
 * [STRIDE: T] [OWASP: A05:2025 Security Misconfiguration] [Endereça: T05, T06]
 * Factory que devolve um middleware Express para validar req.body contra um schema Zod.
 * Devolve 400 com erros ao nível do campo em caso de falha; nunca passa dados inválidos para o controller.
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
