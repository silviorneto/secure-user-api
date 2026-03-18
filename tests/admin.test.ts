import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'
import { Role } from '@prisma/client'
import { hashPassword } from '../src/utils/bcrypt.js'
import { prisma } from './setup.js'
import { registerAndLogin } from './testHelpers.js'

async function createAdminAndLogin() {
  const passwordHash = await hashPassword('Admin123!')
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@test.com', passwordHash, role: Role.ADMIN },
  })
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'Admin123!' })
  return res.body.token as string
}

describe('GET /api/admin/users', () => {
  it('returns user list for admin (without passwordHash)', async () => {
    const token = await createAdminAndLogin()
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    res.body.forEach((u: Record<string, unknown>) => {
      expect(u).not.toHaveProperty('passwordHash')
    })
  })

  it('returns 403 for non-admin user', async () => {
    const token = await registerAndLogin('user@test.com', 'User1234!', 'Normal User')
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/users')
    expect(res.status).toBe(401)
  })
})
