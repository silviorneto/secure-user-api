import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { config } from './config/index.js'
import { globalLimiter } from './middleware/rateLimiter.middleware.js'
import { errorHandler } from './middleware/errorHandler.middleware.js'
import { authRouter } from './routes/auth.routes.js'
import { userRouter } from './routes/user.routes.js'
import { adminRouter } from './routes/admin.routes.js'

/**
 * App is exported separately from the server so supertest can import it
 * without starting the HTTP server (no port binding in tests).
 */
function createApp() {
  const app = express()

  /**
   * [STRIDE: I] [OWASP: A02:2025 Cryptographic Failures]
   * Helmet sets HTTP security headers: CSP, HSTS, X-Frame-Options, etc.
   */
  app.use(helmet())

  /**
   * [OWASP: A02:2025 Cryptographic Failures]
   * CORS restricted to a specific origin — no wildcard.
   */
  app.use(cors({ origin: config.allowedOrigin, credentials: true }))

  /**
   * [STRIDE: D] — Body size limit prevents large payload DoS attacks.
   */
  app.use(express.json({ limit: '10kb' }))

  /**
   * [STRIDE: D] — Global rate limiter applied before any routing logic.
   * Rate limiting before auth prevents brute-force CPU waste on JWT verification.
   */
  app.use(globalLimiter)

  app.use('/api/auth', authRouter)
  app.use('/api/users', userRouter)
  app.use('/api/admin', adminRouter)

  app.use(errorHandler)

  return app
}

export const app = createApp()
