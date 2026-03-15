import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { UpdateProfileSchema } from '../schemas/user.schema.js'

export const userRouter = Router()

userRouter.get('/profile', authMiddleware, getProfile)
userRouter.put('/profile', authMiddleware, validate(UpdateProfileSchema), updateProfile)
