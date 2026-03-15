import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from './src/utils/bcrypt.js'

const prisma = new PrismaClient()

async function main() {
  const adminHash = await hashPassword('Admin123!')
  const userHash = await hashPassword('User1234!')

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@test.com', passwordHash: adminHash, role: Role.ADMIN },
  })

  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: { name: 'Normal User', email: 'user@test.com', passwordHash: userHash, role: Role.USER },
  })

  console.log('Seed complete: admin@test.com (Admin123!) and user@test.com (User1234!)')
}

main().finally(() => prisma.$disconnect())
