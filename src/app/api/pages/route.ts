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

// GET - Obtener todas las páginas
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: [
        { order: 'asc' },
        { title: 'asc' }
      ]
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Error al obtener páginas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva página (solo admin)
export async function POST(request: NextRequest) {
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

    // Verificar que el slug no existe
    const existingPage = await prisma.page.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPage) {
      return NextResponse.json(
        { error: 'Ya existe una página con ese slug' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: validatedData
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear página' },
      { status: 500 }
    )
  }
} 