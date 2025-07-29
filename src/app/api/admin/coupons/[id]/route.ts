import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { z } from 'zod'

const updateCouponSchema = z.object({
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres').max(50).optional(),
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'PRODUCT_SPECIFIC']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'USED_UP']).optional(),
  discountValue: z.number().min(1, 'El valor del descuento debe ser mayor a 0').optional(),
  maxDiscountAmount: z.number().optional(),
  minOrderAmount: z.number().optional(),
  maxUses: z.number().optional(),
  maxUsesPerUser: z.number().optional(),
  applicableProductIds: z.array(z.string()).optional(),
  applicableCategoryIds: z.array(z.string()).optional(),
  validFrom: z.string().transform(str => new Date(str)).optional(),
  validUntil: z.string().optional().transform(str => str ? new Date(str) : null),
  isStackable: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  autoApply: z.boolean().optional()
})

// GET - Obtener cupón específico (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        usages: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            order: {
              select: {
                id: true,
                orderNumber: true,
                total: true,
                status: true,
                createdAt: true
              }
            }
          },
          orderBy: { usedAt: 'desc' }
        },
        _count: {
          select: {
            usages: true,
            orders: true
          }
        }
      }
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      ...coupon,
      usageCount: coupon._count.usages,
      orderCount: coupon._count.orders
    })

  } catch (error) {
    console.error('Error fetching coupon:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar cupón (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const data = updateCouponSchema.parse(body)

    // Verificar que el cupón existe
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id: params.id }
    })

    if (!existingCoupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 })
    }

    // Si se está actualizando el código, verificar que no existe otro con el mismo código
    if (data.code && data.code.toUpperCase() !== existingCoupon.code) {
      const codeExists = await prisma.coupon.findUnique({
        where: { code: data.code.toUpperCase() }
      })

      if (codeExists) {
        return NextResponse.json({ 
          error: 'Ya existe un cupón con este código' 
        }, { status: 400 })
      }
    }

    // Validaciones específicas por tipo
    if (data.type === 'PERCENTAGE' && data.discountValue && data.discountValue > 100) {
      return NextResponse.json({ 
        error: 'El descuento porcentual no puede ser mayor al 100%' 
      }, { status: 400 })
    }

    if (data.type === 'PRODUCT_SPECIFIC' && data.applicableProductIds && data.applicableProductIds.length === 0) {
      return NextResponse.json({ 
        error: 'Los cupones específicos de producto requieren al menos un producto' 
      }, { status: 400 })
    }

    // Actualizar cupón
    const updatedData = { ...data }
    if (data.code) {
      updatedData.code = data.code.toUpperCase()
    }

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: updatedData,
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
      usageCount: coupon._count.usages,
      orderCount: coupon._count.orders
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error updating coupon:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar cupón (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Verificar que el cupón existe
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            usages: true,
            orders: true
          }
        }
      }
    })

    if (!existingCoupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 })
    }

    // Verificar si el cupón ha sido usado
    if (existingCoupon._count.usages > 0) {
      return NextResponse.json({ 
        error: 'No se puede eliminar un cupón que ya ha sido usado. Cambia su estado a INACTIVE en su lugar.' 
      }, { status: 400 })
    }

    // Eliminar cupón
    await prisma.coupon.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Cupón eliminado correctamente' 
    })

  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}