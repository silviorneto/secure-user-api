import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('config', () => {
  beforeEach(() => vi.resetModules())
  afterEach(() => vi.unstubAllEnvs())

  it('throws if JWT_SECRET is missing', async () => {
    vi.stubEnv('JWT_SECRET', '')
    await expect(import('../src/config/index.js')).rejects.toThrow(
      'Missing required environment variable: JWT_SECRET'
    )
  })

  it('throws if DATABASE_URL is missing', async () => {
    vi.stubEnv('DATABASE_URL', '')
    await expect(import('../src/config/index.js')).rejects.toThrow(
      'Missing required environment variable: DATABASE_URL'
    )
  })
})
