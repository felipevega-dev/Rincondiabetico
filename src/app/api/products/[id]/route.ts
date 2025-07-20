import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { z } from 'zod'

const variationSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['SIZE', 'INGREDIENT']),
  name: z.string().min(1, 'El nombre de la variación es requerido'),
  description: z.string().optional(),
  priceChange: z.number().default(0),
  servingSize: z.number().optional(),
  order: z.number().default(0),
  isAvailable: z.boolean().default(true),
})

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(1).optional(),
  stock: z.number().min(0).optional(),
  minStock: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  variations: z.array(variationSchema).optional(),
})

// GET - Obtener producto individual
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        variations: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar producto
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
    const validatedData = updateProductSchema.parse(body)

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (validatedData.name && validatedData.name !== existingProduct.name) {
      const duplicateProduct = await prisma.product.findFirst({
        where: {
          name: validatedData.name,
          id: { not: params.id }
        }
      })

      if (duplicateProduct) {
        return NextResponse.json({ error: 'Ya existe un producto con ese nombre' }, { status: 400 })
      }
    }

    // Si se está actualizando la categoría, verificar que existe
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId }
      })

      if (!category) {
        return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 400 })
      }
    }

    // Preparar datos de actualización
    const updateData: any = {
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      stock: validatedData.stock,
      minStock: validatedData.minStock,
      categoryId: validatedData.categoryId,
      images: validatedData.images,
      isAvailable: validatedData.isAvailable,
    }

    // Manejar variaciones si se proporcionan
    if (validatedData.variations !== undefined) {
      // Eliminar todas las variaciones existentes y crear las nuevas
      updateData.variations = {
        deleteMany: {},
        create: validatedData.variations.map(variation => ({
          type: variation.type,
          name: variation.name,
          description: variation.description,
          priceChange: variation.priceChange,
          servingSize: variation.servingSize,
          order: variation.order,
          isAvailable: variation.isAvailable,
        }))
      }
    }

    // Actualizar producto
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        variations: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar producto
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

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // TODO: Verificar que no hay pedidos pendientes con este producto
    // const ordersWithProduct = await prisma.orderItem.findFirst({
    //   where: {
    //     productId: params.id,
    //     order: {
    //       status: { in: ['PENDIENTE', 'PAGADO', 'PREPARANDO'] }
    //     }
    //   }
    // })

    // if (ordersWithProduct) {
    //   return NextResponse.json({ 
    //     error: 'No se puede eliminar el producto porque tiene pedidos pendientes' 
    //   }, { status: 400 })
    // }

    // Eliminar producto
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 