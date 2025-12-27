import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaSqlite } from '@prisma/adapter-sqlite'
import Database from 'better-sqlite3'

const sqlite = new Database('./prisma/dev.db')
const adapter = new PrismaSqlite(sqlite)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
