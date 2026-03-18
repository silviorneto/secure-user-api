/**
 * [STRIDE: S] [OWASP: A07:2025 Identification and Authentication Failures] [Endereça: T01]
 * bcrypt com cost factor 12 torna ataques de força bruta sobre hashes roubados extremamente lentos.
 * Hashing adaptativo: cost factor 12 demora aproximadamente 250ms por tentativa, inviabilizando ataques offline.
 */
import bcrypt from 'bcrypt'

const COST_FACTOR = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, COST_FACTOR)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
