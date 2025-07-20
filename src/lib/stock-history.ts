import { StockMovementType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export interface StockMovementInput {
  productId: string
  type: StockMovementType
  quantity: number
  reason?: string
  reference?: string
  userId?: string
}

export interface StockUpdateResult {
  success: boolean
  message?: string
  movement?: {
    id: string
    previousStock: number
    newStock: number
  }
}

/**
 * Actualiza el stock de un producto y registra el movimiento en el historial
 */
export async function updateStockWithHistory(input: StockMovementInput): Promise<StockUpdateResult> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Obtener el producto actual
      const product = await tx.product.findUnique({
        where: { id: input.productId },
        select: { stock: true, name: true }
      })

      if (!product) {
        throw new Error('Producto no encontrado')
      }

      const previousStock = product.stock
      
      // Calcular nuevo stock basado en el tipo de movimiento
      let stockChange = input.quantity
      
      // Para ciertos tipos, la cantidad siempre es negativa (reduce stock)
      if (input.type === 'PURCHASE' || input.type === 'MANUAL_DECREASE' || input.type === 'RESERVATION') {
        stockChange = -Math.abs(input.quantity)
      }
      // Para otros tipos, la cantidad siempre es positiva (incrementa stock)
      else if (input.type === 'CANCEL' || input.type === 'MANUAL_INCREASE' || input.type === 'RELEASE' || input.type === 'RETURN') {
        stockChange = Math.abs(input.quantity)
      }

      const newStock = Math.max(0, previousStock + stockChange)

      // Actualizar el stock del producto
      await tx.product.update({
        where: { id: input.productId },
        data: { stock: newStock }
      })

      // Registrar el movimiento en el historial
      const movement = await tx.stockMovement.create({
        data: {
          productId: input.productId,
          type: input.type,
          quantity: stockChange,
          previousStock,
          newStock,
          reason: input.reason,
          reference: input.reference,
          userId: input.userId
        }
      })

      return {
        movement,
        previousStock,
        newStock,
        productName: product.name
      }
    })

    return {
      success: true,
      movement: {
        id: result.movement.id,
        previousStock: result.previousStock,
        newStock: result.newStock
      }
    }

  } catch (error) {
    console.error('Error updating stock with history:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Obtiene el historial de movimientos de stock de un producto
 */
export async function getProductStockHistory(productId: string, limit = 50) {
  try {
    const movements = await prisma.stockMovement.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return {
      success: true,
      movements
    }
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return {
      success: false,
      movements: [],
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Obtiene productos con stock bajo (menor al mínimo configurado)
 */
export async function getLowStockProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { stock: { lte: { $ref: 'minStock' } } }, // SQL: stock <= minStock
              // Como Prisma no soporta referencias de campos directamente, usamos un query raw
            ]
          }
        ]
      },
      include: {
        category: {
          select: { name: true }
        }
      }
    })

    // Filtrar manualmente los productos con stock bajo
    const lowStockProducts = products.filter(product => product.stock <= product.minStock)

    return {
      success: true,
      products: lowStockProducts
    }
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    return {
      success: false,
      products: [],
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Obtiene estadísticas de movimientos de stock
 */
export async function getStockMovementStats(days = 30) {
  try {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    const movements = await prisma.stockMovement.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: fromDate
        }
      },
      _count: {
        id: true
      },
      _sum: {
        quantity: true
      }
    })

    const totalMovements = movements.reduce((sum, movement) => sum + movement._count.id, 0)
    const totalQuantityChanged = movements.reduce((sum, movement) => sum + Math.abs(movement._sum.quantity || 0), 0)

    return {
      success: true,
      stats: {
        totalMovements,
        totalQuantityChanged,
        movementsByType: movements,
        period: `${days} días`
      }
    }
  } catch (error) {
    console.error('Error fetching stock movement stats:', error)
    return {
      success: false,
      stats: null,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Ajusta el stock de un producto manualmente (para uso administrativo)
 */
export async function adjustProductStock(
  productId: string, 
  newStock: number, 
  reason: string, 
  userId?: string
): Promise<StockUpdateResult> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    })

    if (!product) {
      return {
        success: false,
        message: 'Producto no encontrado'
      }
    }

    const difference = newStock - product.stock
    const type: StockMovementType = difference >= 0 ? 'MANUAL_INCREASE' : 'MANUAL_DECREASE'

    return await updateStockWithHistory({
      productId,
      type,
      quantity: Math.abs(difference),
      reason,
      userId
    })
  } catch (error) {
    console.error('Error adjusting product stock:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}