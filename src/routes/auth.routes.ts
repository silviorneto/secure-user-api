import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.middleware.js'
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.middleware.js'
import { RegisterSchema, LoginSchema } from '../schemas/auth.schema.js'

export const authRouter = Router()

authRouter.post('/register', registerLimiter, validate(RegisterSchema), register)
authRouter.post('/login', loginLimiter, validate(LoginSchema), login)
