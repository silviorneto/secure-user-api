import { PrismaClient } from '@prisma/client'

/**
 * Single shared PrismaClient instance for the whole process.
 * Multiple PrismaClient instances each open their own connection pool,
 * which can exhaust database connection limits under load.
 */
export const prisma = new PrismaClient()
