import { describe, it, expect, vi } from 'vitest'

describe('logLoginAttempt', () => {
  it('logs email and ip but not password', async () => {
    const { logLoginAttempt, logger } = await import('../src/utils/logger.js')
    const spy = vi.spyOn(logger, 'info')
    logLoginAttempt('user@test.com', '127.0.0.1', true)
    expect(spy).toHaveBeenCalledOnce()
    const [, meta] = spy.mock.calls[0] as [string, Record<string, unknown>]
    expect(meta).toHaveProperty('email', 'user@test.com')
    expect(meta).toHaveProperty('ip', '127.0.0.1')
    expect(meta).not.toHaveProperty('password')
  })
})
