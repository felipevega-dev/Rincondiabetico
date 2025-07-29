import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para banners
const bannerSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().min(1, 'La imagen es requerida').refine(
    (val) => val.startsWith('http') || val.startsWith('/'),
    'La imagen debe ser una URL válida o una ruta relativa'
  ),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

// GET - Obtener banner por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    })

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      { error: 'Error al obtener banner' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar banner (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = bannerSchema.parse(body)

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error updating banner:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar banner' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar banner (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.banner.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Banner eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      { error: 'Error al eliminar banner' },
      { status: 500 }
    )
  }
} 