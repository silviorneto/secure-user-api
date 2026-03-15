import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'

async function registerAndLogin(email: string, password: string, name = 'Test User') {
  await request(app).post('/api/auth/register').send({ name, email, password })
  const res = await request(app).post('/api/auth/login').send({ email, password })
  return res.body.token as string
}

describe('GET /api/users/profile', () => {
  it('returns profile without passwordHash', async () => {
    const token = await registerAndLogin('getprofile@test.com', 'Pass1234!')
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('email', 'getprofile@test.com')
    expect(res.body).not.toHaveProperty('passwordHash')
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/users/profile')
    expect(res.status).toBe(401)
  })
})

describe('PUT /api/users/profile', () => {
  it('updates name and returns updated profile', async () => {
    const token = await registerAndLogin('putprofile@test.com', 'Pass1234!')
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated Name')
    expect(res.body).not.toHaveProperty('passwordHash')
  })

  it('returns 400 if no fields provided', async () => {
    const token = await registerAndLogin('putprofile2@test.com', 'Pass1234!')
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({})
    expect(res.status).toBe(400)
  })
})
