import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación para páginas
const pageSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  slug: z.string().min(1, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  content: z.string().min(1, 'El contenido es requerido'),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  showInMenu: z.boolean().default(false),
  order: z.number().int().min(0).default(0)
})

// GET - Obtener página por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id }
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Error al obtener página' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar página (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const validatedData = pageSchema.parse(body)

    // Verificar que el slug no existe en otra página
    const existingPage = await prisma.page.findFirst({
      where: {
        slug: validatedData.slug,
        id: { not: params.id }
      }
    })

    if (existingPage) {
      return NextResponse.json(
        { error: 'Ya existe una página con ese slug' },
        { status: 400 }
      )
    }

    const page = await prisma.page.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating page:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar página' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar página (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    await prisma.page.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Página eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Error al eliminar página' },
      { status: 500 }
    )
  }
} 