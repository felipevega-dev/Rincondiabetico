import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

// Tipos de eventos de Clerk
type ClerkWebhookEvent = {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name?: string
    last_name?: string
    phone_numbers?: Array<{
      phone_number: string
    }>
    public_metadata?: {
      role?: string
    }
  }
}

export async function POST(req: NextRequest) {
  // Obtener el webhook secret de las variables de entorno
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Por favor agrega CLERK_WEBHOOK_SECRET a las variables de entorno')
  }

  // Obtener headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // Si no hay headers, error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Headers de webhook faltantes', {
      status: 400,
    })
  }

  // Obtener el cuerpo de la petición
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Crear nueva instancia de Svix con el secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: ClerkWebhookEvent

  // Verificar el webhook
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent
  } catch (err) {
    console.error('Error verificando webhook:', err)
    return new Response('Error: Verificación fallida', {
      status: 400,
    })
  }

  // Manejar el evento
  const { type, data } = evt

  try {
    switch (type) {
      case 'user.created':
        // Crear usuario en nuestra base de datos
        await prisma.user.create({
          data: {
            clerkId: data.id,
            email: data.email_addresses[0]?.email_address || '',
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            phone: data.phone_numbers?.[0]?.phone_number || null,
          },
        })
        console.log(`✅ Usuario creado: ${data.email_addresses[0]?.email_address}`)
        break

      case 'user.updated':
        // Actualizar usuario en nuestra base de datos
        await prisma.user.update({
          where: { clerkId: data.id },
          data: {
            email: data.email_addresses[0]?.email_address || '',
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            phone: data.phone_numbers?.[0]?.phone_number || null,
          },
        })
        console.log(`✅ Usuario actualizado: ${data.email_addresses[0]?.email_address}`)
        break

      case 'user.deleted':
        // Eliminar usuario de nuestra base de datos
        await prisma.user.delete({
          where: { clerkId: data.id },
        })
        console.log(`✅ Usuario eliminado: ${data.id}`)
        break

      default:
        console.log(`Evento no manejado: ${type}`)
    }

    return NextResponse.json({ message: 'Webhook procesado correctamente' })
  } catch (error) {
    console.error('Error procesando webhook:', error)
    return new Response('Error interno del servidor', { status: 500 })
  }
} 