import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('config', () => {
  beforeEach(() => vi.resetModules())

  it('throws if JWT_SECRET is missing', async () => {
    const original = process.env.JWT_SECRET
    delete process.env.JWT_SECRET
    await expect(import('../src/config/index.js')).rejects.toThrow(
      'Missing required environment variable: JWT_SECRET'
    )
    process.env.JWT_SECRET = original
  })

  it('throws if DATABASE_URL is missing', async () => {
    const original = process.env.DATABASE_URL
    delete process.env.DATABASE_URL
    await expect(import('../src/config/index.js')).rejects.toThrow(
      'Missing required environment variable: DATABASE_URL'
    )
    process.env.DATABASE_URL = original
  })
})
