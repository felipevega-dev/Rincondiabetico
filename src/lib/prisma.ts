import { PrismaClient } from '@prisma/client'

// Configuración del cliente Prisma estándar
const createPrismaClient = () => {
  return new PrismaClient({ 
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Singleton pattern para evitar múltiples instancias en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma 