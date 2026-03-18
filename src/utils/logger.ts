/**
 * [STRIDE: R] [OWASP: A09:2025 Security Logging and Monitoring Failures] [Endereça: T04]
 * Logging estruturado com Winston. Regista tentativas de login com IP e timestamp.
 * As passwords nunca são registadas, apenas o email e o IP são capturados.
 */
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
})

export function logLoginAttempt(email: string, ip: string, success: boolean) {
  // A password nunca é parâmetro desta função — impossível de registar acidentalmente
  logger.info('login_attempt', { email, ip, success })
}
