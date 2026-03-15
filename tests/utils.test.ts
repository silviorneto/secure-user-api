import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../src/utils/bcrypt.js'
import { signToken, verifyToken } from '../src/utils/jwt.js'

describe('bcrypt utils', () => {
  it('hashes a password and verifies it correctly', async () => {
    const hash = await hashPassword('MyPassword1!')
    expect(hash).not.toBe('MyPassword1!')
    expect(await comparePassword('MyPassword1!', hash)).toBe(true)
  })

  it('rejects wrong password', async () => {
    const hash = await hashPassword('MyPassword1!')
    expect(await comparePassword('wrong', hash)).toBe(false)
  })
})

describe('jwt utils', () => {
  it('signs and verifies a token', () => {
    const token = signToken({ userId: 'abc123', role: 'USER' })
    const payload = verifyToken(token)
    expect(payload.userId).toBe('abc123')
    expect(payload.role).toBe('USER')
  })

  it('throws on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow()
  })
})
