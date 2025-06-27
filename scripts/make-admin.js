// Script para hacer admin a un usuario durante desarrollo
// Uso: node scripts/make-admin.js tu-email@ejemplo.com

require('dotenv').config({ path: '.env.local' })
const { clerkClient } = require('@clerk/nextjs/server')

async function makeUserAdmin(email) {
  try {
    console.log(`🔍 Buscando usuario con email: ${email}`)
    
    const client = await clerkClient()
    const users = await client.users.getUserList({
      emailAddress: [email]
    })

    if (users.data.length === 0) {
      console.error('❌ Usuario no encontrado')
      console.log('💡 Asegúrate de que el usuario se haya registrado primero en la app')
      return
    }

    const user = users.data[0]
    console.log(`✅ Usuario encontrado: ${user.firstName} ${user.lastName}`)
    
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'admin'
      }
    })

    console.log(`🎉 ¡${email} ahora es administrador!`)
    console.log('🔄 El usuario necesitará cerrar sesión y volver a iniciar para ver los cambios')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Obtener email del argumento de línea de comandos
const email = process.argv[2]

if (!email) {
  console.error('❌ Por favor proporciona un email')
  console.log('Uso: node scripts/make-admin.js tu-email@ejemplo.com')
  process.exit(1)
}

makeUserAdmin(email) 