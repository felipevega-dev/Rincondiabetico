import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'

// GET - Obtener cupones disponibles para el usuario
export async function GET(_request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener cupones públicos activos que el usuario puede usar
    const publicCoupons = await prisma.coupon.findMany({
      where: {
        isPublic: true,
        status: 'ACTIVE',
        OR: [
          { validUntil: null }, // Sin fecha de expiración
          { validUntil: { gte: new Date() } } // No expirados
        ]
      },
      include: {
        usages: {
          where: { userId: dbUser.id },
          select: { id: true }
        },
        _count: {
          select: { usages: true }
        }
      }
    })

    // Filtrar cupones que el usuario puede usar
    const availableCoupons = publicCoupons.filter(coupon => {
      // Verificar límite total de usos
      if (coupon.maxUses && coupon._count.usages >= coupon.maxUses) {
        return false
      }

      // Verificar límite de usos por usuario
      if (coupon.maxUsesPerUser && coupon.usages.length >= coupon.maxUsesPerUser) {
        return false
      }

      return true
    })

    // Mapear datos para el frontend
    const couponsData = availableCoupons.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      status: coupon.status,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderAmount: coupon.minOrderAmount,
      maxUses: coupon.maxUses,
      maxUsesPerUser: coupon.maxUsesPerUser,
      usedCount: coupon._count.usages,
      userUsages: coupon.usages.length,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isStackable: coupon.isStackable,
      autoApply: coupon.autoApply
    }))

    return NextResponse.json({
      coupons: couponsData,
      total: couponsData.length
    })

  } catch (error) {
    console.error('Error fetching user coupons:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}