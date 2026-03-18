/**
 * [STRIDE: T] [OWASP: A05:2025 Security Misconfiguration] [Endereça: T05, T06]
 * Os schemas Zod validam todos os dados de entrada na fronteira da aplicação.
 * Previnem injecção via inputs malformados ou excessivos antes de chegarem à lógica de negócio.
 */
import { z } from 'zod'

export const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/

export const RegisterSchema = z.object({
  name: z.string().regex(nameRegex, 'Name contains invalid characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'), // limite do bcrypt
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
