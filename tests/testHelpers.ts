import request from 'supertest'
import { app } from '../src/app.js'

export async function registerAndLogin(email: string, password: string, name = 'Test User') {
  await request(app).post('/api/auth/register').send({ name, email, password })
  const res = await request(app).post('/api/auth/login').send({ email, password })
  return res.body.token as string
}
