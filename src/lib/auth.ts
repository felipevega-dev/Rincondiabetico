import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

// Tipos de roles
export type UserRole = 'admin' | 'customer'

// Verificar si el usuario es admin
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser()
  return user?.publicMetadata?.role === 'admin'
}

// Obtener el usuario actual con datos de la DB
export async function getCurrentUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  // Solo buscar en BD, no crear
  return await prisma.user.findUnique({
    where: { clerkId: userId }
  })
}

// Obtener o crear usuario en nuestra DB
export async function getOrCreateUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  // Primero verificar si ya existe en la BD
  let user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  // Solo crear si no existe
  if (!user) {
    const clerkUser = await currentUser()
    if (!clerkUser) return null

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      }
    })
  }

  return user
}

// Asignar rol de admin a un usuario (solo para desarrollo inicial)
export async function makeUserAdmin(email: string) {
  try {
    const client = await clerkClient()
    const users = await client.users.getUserList({
      emailAddress: [email]
    })

    if (users.data.length === 0) {
      throw new Error('Usuario no encontrado')
    }

    const user = users.data[0]
    
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'admin'
      }
    })

    console.log(`✅ Usuario ${email} ahora es admin`)
    return true
  } catch (error) {
    console.error('Error asignando rol de admin:', error)
    return false
  }
} 