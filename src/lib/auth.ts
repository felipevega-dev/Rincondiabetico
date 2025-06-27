import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from './prisma'

// Tipos de roles
export type UserRole = 'admin' | 'customer'

// Verificar si el usuario es admin
export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth()
    if (!userId) return false

    // Verificar en Clerk directamente usando publicMetadata
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.publicMetadata?.role === 'admin'
  } catch (error) {
    console.error('Error verificando rol de admin:', error)
    return false
  }
}

// Obtener el usuario actual con datos de la DB
export async function getCurrentUser() {
  try {
    const { userId } = await auth()
    if (!userId) return null

    // Buscar en nuestra base de datos
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    return user
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    return null
  }
}

// Obtener o crear usuario en nuestra DB
export async function getOrCreateUser() {
  try {
    const { userId } = await auth()
    if (!userId) return null

    // Intentar encontrar el usuario
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    // Si no existe, obtener datos de Clerk y crear
    if (!user) {
      const client = await clerkClient()
      const clerkUser = await client.users.getUser(userId)
      
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        }
      })
    }

    return user
  } catch (error) {
    console.error('Error obteniendo o creando usuario:', error)
    return null
  }
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