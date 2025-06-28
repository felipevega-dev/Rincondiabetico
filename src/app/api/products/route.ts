import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { z } from 'zod'

const variationSchema = z.object({
  type: z.enum(['SIZE', 'INGREDIENT']),
  name: z.string().min(1, 'El nombre de la variación es requerido'),
  description: z.string().optional(),
  priceChange: z.number().default(0),
  servingSize: z.number().optional(),
  order: z.number().default(0),
  isAvailable: z.boolean().default(true),
})

const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().min(0, 'El stock no puede ser negativo').default(0),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean(),
  variations: z.array(variationSchema).optional(),
})

// GET - Obtener todos los productos (con filtros opcionales)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const available = searchParams.get('available')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (available !== null) {
      where.isAvailable = available === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener productos con paginación
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          variations: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
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
    const validatedData = createProductSchema.parse(body)

    // Verificar que la categoría existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    })

    if (!categoryExists) {
      return NextResponse.json({ error: 'La categoría especificada no existe' }, { status: 400 })
    }

    // Generar slug único
    const baseSlug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .trim()

    // Verificar que el slug sea único
    let slug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear producto con variaciones
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price, // Precio en pesos chilenos
        stock: validatedData.stock,
        categoryId: validatedData.categoryId,
        images: validatedData.images || [],
        isAvailable: validatedData.isAvailable,
        slug,
        variations: validatedData.variations ? {
          create: validatedData.variations.map(variation => ({
            type: variation.type,
            name: variation.name,
            description: variation.description,
            priceChange: variation.priceChange,
            servingSize: variation.servingSize,
            order: variation.order,
            isAvailable: variation.isAvailable,
          }))
        } : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        variations: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 