import { PrismaClient } from '@prisma/client'
import { beforeEach, afterAll } from 'vitest'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

// Clean all tables before each test to ensure isolation
beforeEach(async () => {
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

export { prisma }
