import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para configuración de tienda
const storeSettingsSchema = z.object({
  storeName: z.string().min(1, 'El nombre de la tienda es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(1, 'WhatsApp es requerido'),
  description: z.string().optional(),
  openingHours: z.object({
    weekdays: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean()
    }),
    saturday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean()
    }),
    sunday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean()
    })
  }),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional()
  }),
  isOpen: z.boolean().default(true)
})

// GET - Obtener configuración de la tienda
export async function GET() {
  try {
    let settings = await prisma.storeSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    // Si no existe configuración, crear una por defecto
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: 'Postres Pasmiño',
          address: 'Progreso 393, Chiguayante, Región del Biobío, Chile',
          phone: '+56 9 1234 5678',
          email: 'contacto@rincondiabetico.cl',
          whatsapp: '+56 9 1234 5678',
          description: 'Dulces especiales para diabéticos',
          openingHours: {
            weekdays: { open: '09:00', close: '19:00', isOpen: true },
            saturday: { open: '09:00', close: '17:00', isOpen: true },
            sunday: { open: '10:00', close: '15:00', isOpen: true }
          },
          socialMedia: {
            facebook: '',
            instagram: '',
            whatsapp: '+56 9 1234 5678',
            email: 'contacto@rincondiabetico.cl'
          },
          isOpen: true
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching store settings:', error)
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración de la tienda (solo admin)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = storeSettingsSchema.parse(body)

    // Buscar configuración existente
    let settings = await prisma.storeSettings.findFirst()

    if (settings) {
      // Actualizar existente
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: validatedData
      })
    } else {
      // Crear nueva
      settings = await prisma.storeSettings.create({
        data: validatedData
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating store settings:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    )
  }
} 