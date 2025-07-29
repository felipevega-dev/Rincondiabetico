import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { z } from 'zod'

const updateCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().optional(),
})

// GET - Obtener categoría por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            available: true
          }
        },
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar categoría
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación y permisos de admin
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin()
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Validar datos
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    // Verificar que la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    // Si se está actualizando el nombre, verificar que no exista otra con el mismo nombre
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name: validatedData.name }
      })

      if (nameExists) {
        return NextResponse.json({ error: 'Ya existe una categoría con ese nombre' }, { status: 400 })
      }
    }

    // Actualizar categoría
    const category = await prisma.category.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación y permisos de admin
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin()
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Verificar que la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    // Verificar que no tenga productos asociados
    if (existingCategory._count.products > 0) {
      return NextResponse.json({ 
        error: 'No se puede eliminar la categoría porque tiene productos asociados' 
      }, { status: 400 })
    }

    // Eliminar categoría
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Categoría eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 