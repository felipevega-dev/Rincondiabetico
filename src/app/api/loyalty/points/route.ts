import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { z } from 'zod'

const redeemPointsSchema = z.object({
  points: z.number().min(1, 'Debe canjear al menos 1 punto'),
  orderId: z.string().optional()
})

// Configuración del sistema de puntos
const POINTS_CONFIG = {
  EARN_RATE: 1, // 1 punto por cada 100 CLP gastados
  REDEEM_RATE: 100, // 1 punto = 100 CLP de descuento
  LEVELS: {
    BRONZE: { min: 0, max: 999, multiplier: 1.0 },
    SILVER: { min: 1000, max: 4999, multiplier: 1.2 },
    GOLD: { min: 5000, max: 99999, multiplier: 1.5 },
    VIP: { min: 100000, max: Infinity, multiplier: 2.0 }
  }
}

// GET - Obtener puntos del usuario
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await getOrCreateUser()
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener o crear registro de puntos
    let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: { userId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Últimas 10 transacciones
        }
      }
    })

    if (!loyaltyPoints) {
      // Crear registro inicial de puntos
      loyaltyPoints = await prisma.loyaltyPoints.create({
        data: {
          userId: user.id,
          totalPoints: 0,
          availablePoints: 0,
          usedPoints: 0,
          level: 'BRONZE'
        },
        include: {
          transactions: true
        }
      })
    }

    // Calcular nivel actual basado en puntos totales
    const currentLevel = calculateLevel(loyaltyPoints.totalPoints)
    
    // Actualizar nivel si cambió
    if (currentLevel !== loyaltyPoints.level) {
      loyaltyPoints = await prisma.loyaltyPoints.update({
        where: { id: loyaltyPoints.id },
        data: { level: currentLevel },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })
    }

    // Información del nivel actual y siguiente
    const levelInfo = POINTS_CONFIG.LEVELS[currentLevel]
    const nextLevel = getNextLevel(currentLevel)
    const pointsToNextLevel = nextLevel ? POINTS_CONFIG.LEVELS[nextLevel].min - loyaltyPoints.totalPoints : 0

    return NextResponse.json({
      points: loyaltyPoints,
      levelInfo: {
        current: currentLevel,
        next: nextLevel,
        pointsToNext: Math.max(0, pointsToNextLevel),
        multiplier: levelInfo.multiplier
      },
      config: {
        earnRate: POINTS_CONFIG.EARN_RATE,
        redeemRate: POINTS_CONFIG.REDEEM_RATE
      }
    })

  } catch (error) {
    console.error('Error fetching loyalty points:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Canjear puntos por descuento
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await getOrCreateUser()
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { points, orderId } = redeemPointsSchema.parse(body)

    // Obtener registro de puntos
    const loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: { userId: user.id }
    })

    if (!loyaltyPoints) {
      return NextResponse.json({ 
        error: 'No tienes puntos de lealtad' 
      }, { status: 400 })
    }

    // Verificar que tiene suficientes puntos
    if (loyaltyPoints.availablePoints < points) {
      return NextResponse.json({ 
        error: `No tienes suficientes puntos. Disponibles: ${loyaltyPoints.availablePoints}` 
      }, { status: 400 })
    }

    // Calcular descuento en CLP
    const discountAmount = points * POINTS_CONFIG.REDEEM_RATE

    // Realizar transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar puntos
      const updatedPoints = await tx.loyaltyPoints.update({
        where: { id: loyaltyPoints.id },
        data: {
          availablePoints: loyaltyPoints.availablePoints - points,
          usedPoints: loyaltyPoints.usedPoints + points
        }
      })

      // Registrar transacción
      const transaction = await tx.pointTransaction.create({
        data: {
          loyaltyId: loyaltyPoints.id,
          type: 'REDEEMED_DISCOUNT',
          points: -points,
          description: `Canjeados por descuento de ${discountAmount.toLocaleString('es-CL')} CLP`,
          reference: orderId
        }
      })

      return { updatedPoints, transaction, discountAmount }
    })

    return NextResponse.json({
      success: true,
      pointsRedeemed: points,
      discountAmount: result.discountAmount,
      remainingPoints: result.updatedPoints.availablePoints,
      transaction: result.transaction
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error redeeming points:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Función para calcular nivel basado en puntos totales
function calculateLevel(totalPoints: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP' {
  if (totalPoints >= POINTS_CONFIG.LEVELS.VIP.min) return 'VIP'
  if (totalPoints >= POINTS_CONFIG.LEVELS.GOLD.min) return 'GOLD'
  if (totalPoints >= POINTS_CONFIG.LEVELS.SILVER.min) return 'SILVER'
  return 'BRONZE'
}

// Función para obtener siguiente nivel
function getNextLevel(currentLevel: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP'): 'SILVER' | 'GOLD' | 'VIP' | null {
  switch (currentLevel) {
    case 'BRONZE': return 'SILVER'
    case 'SILVER': return 'GOLD'
    case 'GOLD': return 'VIP'
    case 'VIP': return null
  }
}

// Función para agregar puntos por compra (llamada desde webhook de pagos)
export async function addPurchasePoints(userId: string, orderTotal: number, orderId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return

    // Obtener o crear registro de puntos
    let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: { userId }
    })

    if (!loyaltyPoints) {
      loyaltyPoints = await prisma.loyaltyPoints.create({
        data: {
          userId,
          totalPoints: 0,
          availablePoints: 0,
          usedPoints: 0,
          level: 'BRONZE'
        }
      })
    }

    // Calcular puntos ganados (1 punto por cada 100 CLP)
    const basePoints = Math.floor(orderTotal / 100)
    
    // Aplicar multiplicador por nivel
    const levelMultiplier = POINTS_CONFIG.LEVELS[loyaltyPoints.level].multiplier
    const earnedPoints = Math.floor(basePoints * levelMultiplier)

    if (earnedPoints > 0) {
      // Actualizar puntos en transacción
      await prisma.$transaction(async (tx) => {
        // Actualizar totales
        await tx.loyaltyPoints.update({
          where: { id: loyaltyPoints!.id },
          data: {
            totalPoints: loyaltyPoints!.totalPoints + earnedPoints,
            availablePoints: loyaltyPoints!.availablePoints + earnedPoints,
            level: calculateLevel(loyaltyPoints!.totalPoints + earnedPoints)
          }
        })

        // Registrar transacción
        await tx.pointTransaction.create({
          data: {
            loyaltyId: loyaltyPoints!.id,
            type: 'EARNED_PURCHASE',
            points: earnedPoints,
            description: `Ganados por compra de ${orderTotal.toLocaleString('es-CL')} CLP`,
            reference: orderId
          }
        })
      })
    }

    return earnedPoints
  } catch (error) {
    console.error('Error adding purchase points:', error)
    return 0
  }
}