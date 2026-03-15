/**
 * [STRIDE: R] [OWASP: A09:2025 Security Logging and Monitoring Failures]
 * Structured logging with Winston. Logs login attempts with IP and timestamp.
 * Passwords are never logged — only email and IP are captured.
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
  // Never log the password — only the email (for audit) and IP
  logger.info('login_attempt', { email, ip, success, timestamp: new Date().toISOString() })
}
