/**
 * [STRIDE: T] [OWASP: A05:2025 Security Misconfiguration]
 * Zod schema for profile updates. The `role` field is intentionally absent —
 * an attacker cannot escalate privileges by injecting role into the request body.
 */
import { z } from 'zod'

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/

export const UpdateProfileSchema = z
  .object({
    name: z.string().regex(nameRegex, 'Name contains invalid characters').optional(),
    email: z.string().email('Invalid email format').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
