import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { z } from 'zod'

const createCouponSchema = z.object({
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres').max(50),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'PRODUCT_SPECIFIC']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'USED_UP']).default('ACTIVE'),
  discountValue: z.number().min(1, 'El valor del descuento debe ser mayor a 0'),
  maxDiscountAmount: z.number().optional(),
  minOrderAmount: z.number().optional(),
  maxUses: z.number().optional(),
  maxUsesPerUser: z.number().optional(),
  applicableProductIds: z.array(z.string()).default([]),
  applicableCategoryIds: z.array(z.string()).default([]),
  validFrom: z.string().transform(str => new Date(str)),
  validUntil: z.string().optional().transform(str => str ? new Date(str) : null),
  isStackable: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  autoApply: z.boolean().default(false)
})

const updateCouponSchema = createCouponSchema.partial()

// GET - Listar cupones (admin)
export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: {
          usages: {
            select: {
              id: true,
              usedAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              usages: true,
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.coupon.count({ where })
    ])

    return NextResponse.json({
      coupons: coupons.map(coupon => ({
        ...coupon,
        usageCount: coupon.usedCount,
        orderCount: coupon._count.orders
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear cupón (admin)
export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const data = createCouponSchema.parse(body)

    // Verificar que el código no exista
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() }
    })

    if (existingCoupon) {
      return NextResponse.json({ 
        error: 'Ya existe un cupón con este código' 
      }, { status: 400 })
    }

    // Validaciones específicas por tipo
    if (data.type === 'PERCENTAGE') {
      if (data.discountValue > 100) {
        return NextResponse.json({ 
          error: 'El descuento porcentual no puede ser mayor al 100%' 
        }, { status: 400 })
      }
    }

    if (data.type === 'PRODUCT_SPECIFIC' && data.applicableProductIds.length === 0) {
      return NextResponse.json({ 
        error: 'Los cupones específicos de producto requieren al menos un producto' 
      }, { status: 400 })
    }

    // Crear cupón
    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase() // Normalizar código a mayúsculas
      },
      include: {
        _count: {
          select: {
            usages: true,
            orders: true
          }
        }
      }
    })

    return NextResponse.json({
      ...coupon,
      usageCount: coupon.usedCount,
      orderCount: coupon._count.orders
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error creating coupon:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}