import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { z } from 'zod'

const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID es requerido')
})

// GET - Obtener wishlist del usuario
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: dbUser.id },
      include: {
        product: {
          include: {
            category: {
              select: { id: true, name: true }
            },
            variations: {
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      items: wishlistItems.map(item => ({
        id: item.id,
        product: item.product,
        addedAt: item.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Agregar producto a wishlist
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = addToWishlistSchema.parse(body)

    // Verificar que el producto existe y está disponible
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      select: { id: true, name: true, isAvailable: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    if (!product.isAvailable) {
      return NextResponse.json({ error: 'Producto no disponible' }, { status: 400 })
    }

    // Verificar si ya está en la wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId: validatedData.productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json({ 
        message: 'El producto ya está en tu lista de favoritos',
        alreadyExists: true 
      })
    }

    // Agregar a wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: dbUser.id,
        productId: validatedData.productId
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        }
      }
    })

    return NextResponse.json({
      message: `${product.name} agregado a favoritos`,
      item: wishlistItem
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Remover producto de wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = addToWishlistSchema.parse(body)

    // Verificar que el item existe
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId: validatedData.productId
        }
      },
      include: {
        product: {
          select: { name: true }
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Producto no encontrado en favoritos' }, { status: 404 })
    }

    // Remover de wishlist
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id }
    })

    return NextResponse.json({
      message: `${existingItem.product.name} removido de favoritos`
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}