/**
 * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures]
 * bcrypt with cost factor 12 prevents brute-force attacks on stolen password hashes.
 * Adaptive hashing: cost factor 12 takes ~250ms, making offline attacks impractical.
 */
import bcrypt from 'bcrypt'

const COST_FACTOR = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, COST_FACTOR)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
