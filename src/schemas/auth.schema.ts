/**
 * [STRIDE: T] [OWASP: A05:2025 Security Misconfiguration]
 * Zod schemas validate all incoming data at the boundary.
 * Prevents injection via malformed or oversized inputs before they reach business logic.
 */
import { z } from 'zod'

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/

export const RegisterSchema = z.object({
  name: z.string().regex(nameRegex, 'Name contains invalid characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'), // bcrypt limit
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
