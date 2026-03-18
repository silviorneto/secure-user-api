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
 * A app é exportada separadamente do servidor para que o supertest a possa importar
 * sem iniciar o servidor HTTP (sem binding de porta nos testes).
 */
function createApp() {
  const app = express()

  /**
   * [STRIDE: I] [OWASP: A02:2025 Cryptographic Failures] [Endereça: T09]
   * O Helmet define cabeçalhos HTTP de segurança: CSP, HSTS, X-Frame-Options, etc.
   * Remove o cabeçalho X-Powered-By que revelaria a tecnologia usada no servidor.
   */
  app.use(helmet())

  /**
   * [STRIDE: I] [OWASP: A02:2025 Cryptographic Failures] [Endereça: T14]
   * CORS restrito a uma origin específica — sem wildcard.
   * Pedidos de origens não autorizadas são bloqueados pelo browser.
   */
  app.use(cors({ origin: config.allowedOrigin, credentials: true }))

  /**
   * [STRIDE: D] [OWASP: A04:2025 Insecure Design] [Endereça: T10]
   * Limite de tamanho do body previne ataques DoS por payloads excessivamente grandes.
   */
  app.use(express.json({ limit: '10kb' }))

  /**
   * [STRIDE: D] [OWASP: A04:2025 Insecure Design] [Endereça: T11]
   * Rate limiter global aplicado antes de qualquer lógica de routing.
   * Actua antes da autenticação para evitar desperdício de CPU em verificações JWT durante brute-force.
   */
  app.use(globalLimiter)

  app.use('/api/auth', authRouter)
  app.use('/api/users', userRouter)
  app.use('/api/admin', adminRouter)

  app.use(errorHandler)

  return app
}

export const app = createApp()
