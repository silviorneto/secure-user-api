/**
 * [STRIDE: T] [OWASP: A05:2025 Security Misconfiguration] [Endereça: T06]
 * Schema Zod para actualização de perfil. O campo `role` está intencionalmente ausente,
 * um atacante não pode escalar privilégios injectando role no body do pedido.
 */
import { z } from 'zod'
import { nameRegex } from './auth.schema.js'

export const UpdateProfileSchema = z
  .object({
    name: z.string().regex(nameRegex, 'Name contains invalid characters').optional(),
    email: z.string().email('Invalid email format').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
