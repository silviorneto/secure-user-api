import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'

describe('POST /api/auth/register', () => {
  it('returns 201 on successful registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice Test', email: 'alice@test.com', password: 'Alice123!' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('message')
  })

  it('returns 201 even for duplicate email (prevents enumeration)', async () => {
    const payload = { name: 'Alice Test', email: 'dup@test.com', password: 'Alice123!' }
    await request(app).post('/api/auth/register').send(payload)
    const res = await request(app).post('/api/auth/register').send(payload)
    // Must return 201, NOT 409 — identical response prevents user enumeration
    expect(res.status).toBe(201)
  })

  it('returns 400 on invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'not-email', password: 'Alice123!' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  it('returns 200 and JWT on valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob Test', email: 'bob@test.com', password: 'Bob12345!' })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@test.com', password: 'Bob12345!' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('returns 401 on wrong password (generic message)', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob Test', email: 'bob2@test.com', password: 'Bob12345!' })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob2@test.com', password: 'WrongPassword!' })
    expect(res.status).toBe(401)
    // Must not reveal whether email exists or password is wrong
    expect(res.body.error).toBe('Invalid credentials')
  })

  it('returns 401 for non-existent user (generic message)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@test.com', password: 'Ghost123!' })
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid credentials')
  })
})
