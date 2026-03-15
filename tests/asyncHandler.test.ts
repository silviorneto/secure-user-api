import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import { asyncHandler } from '../src/utils/asyncHandler.js'

describe('asyncHandler', () => {
  it('forwards async rejection to Express error handler', async () => {
    const app = express()
    app.get('/fail', asyncHandler(async () => { throw new Error('boom') }))
    app.use((_err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ error: 'caught' })
    })
    const res = await request(app).get('/fail')
    expect(res.status).toBe(500)
    expect(res.body.error).toBe('caught')
  })
})
