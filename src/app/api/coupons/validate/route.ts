import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { z } from 'zod'

const validateCouponSchema = z.object({
  code: z.string().min(1, 'El código del cupón es requerido'),
  cartTotal: z.number().min(0, 'El total del carrito debe ser mayor a 0'),
  cartItems: z.array(z.object({
    productId: z.string(),
    categoryId: z.string(),
    quantity: z.number().min(1),
    price: z.number()
  })).optional()
})

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    
    // Para cupones públicos, no requerir autenticación
    // Para cupones privados o límites por usuario, sí requerir
    
    const body = await request.json()
    const { code, cartTotal, cartItems } = validateCouponSchema.parse(body)

    // Buscar cupón por código
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        usages: true
      }
    })

    if (!coupon) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Cupón no encontrado' 
      }, { status: 404 })
    }

    // Verificar estado activo
    if (coupon.status !== 'ACTIVE') {
      return NextResponse.json({ 
        valid: false, 
        error: 'Este cupón no está activo' 
      }, { status: 400 })
    }

    // Verificar fecha de validez
    const now = new Date()
    if (coupon.validFrom > now) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Este cupón aún no es válido' 
      }, { status: 400 })
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Este cupón ha expirado' 
      }, { status: 400 })
    }

    // Verificar límite de usos totales
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Este cupón ha alcanzado el límite de usos' 
      }, { status: 400 })
    }

    // Verificar monto mínimo de pedido
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({ 
        valid: false, 
        error: `El monto mínimo para este cupón es ${coupon.minOrderAmount.toLocaleString('es-CL')} CLP` 
      }, { status: 400 })
    }

    // Verificar límite de usos por usuario (solo si está autenticado)
    if (clerkUser && coupon.maxUsesPerUser) {
      const dbUser = await getOrCreateUser()
      if (dbUser) {
        const userUsageCount = coupon.usages.filter(usage => usage.userId === dbUser.id).length
        
        if (userUsageCount >= coupon.maxUsesPerUser) {
          return NextResponse.json({ 
            valid: false, 
            error: 'Has alcanzado el límite de usos para este cupón' 
          }, { status: 400 })
        }
      }
    }

    // Verificar restricciones de productos/categorías
    if (cartItems && cartItems.length > 0) {
      // Si hay productos específicos definidos
      if (coupon.applicableProductIds.length > 0) {
        const hasApplicableProduct = cartItems.some(item => 
          coupon.applicableProductIds.includes(item.productId)
        )
        
        if (!hasApplicableProduct) {
          return NextResponse.json({ 
            valid: false, 
            error: 'Este cupón no es válido para los productos en tu carrito' 
          }, { status: 400 })
        }
      }

      // Si hay categorías específicas definidas
      if (coupon.applicableCategoryIds.length > 0) {
        const hasApplicableCategory = cartItems.some(item => 
          coupon.applicableCategoryIds.includes(item.categoryId)
        )
        
        if (!hasApplicableCategory) {
          return NextResponse.json({ 
            valid: false, 
            error: 'Este cupón no es válido para las categorías de productos en tu carrito' 
          }, { status: 400 })
        }
      }
    }

    // Calcular descuento
    let discountAmount = 0
    
    switch (coupon.type) {
      case 'PERCENTAGE':
        discountAmount = Math.round(cartTotal * (coupon.discountValue / 100))
        
        // Aplicar límite máximo de descuento si existe
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount
        }
        break
        
      case 'FIXED_AMOUNT':
        discountAmount = Math.min(coupon.discountValue, cartTotal)
        break
        
      case 'FREE_SHIPPING':
        // Para futuro uso cuando se implemente envío
        discountAmount = 0
        break
        
      case 'PRODUCT_SPECIFIC':
        // Calcular descuento solo para productos específicos
        if (cartItems && coupon.applicableProductIds.length > 0) {
          const applicableTotal = cartItems
            .filter(item => coupon.applicableProductIds.includes(item.productId))
            .reduce((total, item) => total + (item.price * item.quantity), 0)
          
          if (coupon.type === 'PERCENTAGE') {
            discountAmount = Math.round(applicableTotal * (coupon.discountValue / 100))
          } else {
            discountAmount = Math.min(coupon.discountValue, applicableTotal)
          }
        }
        break
    }

    // Asegurar que el descuento no sea mayor al total del carrito
    discountAmount = Math.min(discountAmount, cartTotal)

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        discountValue: coupon.discountValue,
        isStackable: coupon.isStackable
      },
      discountAmount,
      finalTotal: cartTotal - discountAmount
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        valid: false, 
        error: error.errors[0].message 
      }, { status: 400 })
    }
    
    console.error('Error validating coupon:', error)
    return NextResponse.json({ 
      valid: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}