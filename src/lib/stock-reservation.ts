import { prisma } from '@/lib/prisma'

export interface ReservationRequest {
  productId: string
  quantity: number
  sessionId: string
}

// Reservar stock temporalmente por 15 minutos
export async function reserveStock(request: ReservationRequest): Promise<boolean> {
  try {
    const { productId, quantity, sessionId } = request
    
    // Verificar stock disponible
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stockReservations: {
          where: {
            expiresAt: {
              gt: new Date()
            }
          }
        }
      }
    })
    
    if (!product) {
      return false
    }
    
    // Calcular stock reservado actualmente
    const reservedStock = product.stockReservations.reduce((total, reservation) => {
      return total + reservation.quantity
    }, 0)
    
    const availableStock = product.stock - reservedStock
    
    if (availableStock < quantity) {
      return false
    }
    
    // Verificar si ya existe una reserva para esta sesión
    const existingReservation = await prisma.stockReservation.findFirst({
      where: {
        productId,
        sessionId
      }
    })
    
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    
    if (existingReservation) {
      // Actualizar reserva existente
      await prisma.stockReservation.update({
        where: { id: existingReservation.id },
        data: {
          quantity,
          expiresAt
        }
      })
    } else {
      // Crear nueva reserva
      await prisma.stockReservation.create({
        data: {
          productId,
          quantity,
          sessionId,
          expiresAt
        }
      })
    }
    
    return true
  } catch (error) {
    console.error('Error reserving stock:', error)
    return false
  }
}

// Liberar reserva de stock
export async function releaseStockReservation(sessionId: string, productId?: string): Promise<void> {
  try {
    const where: any = { sessionId }
    if (productId) {
      where.productId = productId
    }
    
    await prisma.stockReservation.deleteMany({
      where
    })
  } catch (error) {
    console.error('Error releasing stock reservation:', error)
  }
}

// Convertir reservas a pedido real (confirmación de compra)
export async function confirmStockReservation(sessionId: string): Promise<void> {
  try {
    // Simplemente eliminar las reservas ya que el stock se reducirá en el pedido real
    await prisma.stockReservation.deleteMany({
      where: { sessionId }
    })
  } catch (error) {
    console.error('Error confirming stock reservation:', error)
  }
}

// Limpiar reservas expiradas
export async function cleanupExpiredReservations(): Promise<number> {
  try {
    const result = await prisma.stockReservation.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    return result.count
  } catch (error) {
    console.error('Error cleaning up expired reservations:', error)
    return 0
  }
}

// Obtener stock disponible considerando reservas
export async function getAvailableStock(productId: string): Promise<number> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stockReservations: {
          where: {
            expiresAt: {
              gt: new Date()
            }
          }
        }
      }
    })
    
    if (!product) {
      return 0
    }
    
    const reservedStock = product.stockReservations.reduce((total, reservation) => {
      return total + reservation.quantity
    }, 0)
    
    return Math.max(0, product.stock - reservedStock)
  } catch (error) {
    console.error('Error getting available stock:', error)
    return 0
  }
}

// Verificar si hay suficiente stock disponible
export async function hasAvailableStock(productId: string, quantity: number): Promise<boolean> {
  const availableStock = await getAvailableStock(productId)
  return availableStock >= quantity
}