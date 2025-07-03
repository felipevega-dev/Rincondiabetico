import { prisma } from '@/lib/prisma'

export interface StockValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ProductStock {
  productId: string
  name: string
  currentStock: number
  requestedQuantity: number
  isAvailable: boolean
}

// Validar stock disponible para múltiples productos
export async function validateProductStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<StockValidationResult> {
  const result: StockValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  try {
    // Obtener productos con stock actual
    const productIds = items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        stock: true,
        isAvailable: true
      }
    })

    // Crear mapa de productos para fácil acceso
    const productMap = new Map(products.map(p => [p.id, p]))

    // Validar cada item
    for (const item of items) {
      const product = productMap.get(item.productId)
      
      if (!product) {
        result.errors.push(`Producto no encontrado: ${item.productId}`)
        result.isValid = false
        continue
      }

      if (!product.isAvailable) {
        result.errors.push(`${product.name} no está disponible`)
        result.isValid = false
        continue
      }

      if (product.stock < item.quantity) {
        result.errors.push(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`
        )
        result.isValid = false
        continue
      }

      // Advertencias para stock bajo
      if (product.stock <= 5 && product.stock > item.quantity) {
        result.warnings.push(`Stock bajo para ${product.name}: ${product.stock} unidades`)
      }
    }

    return result
  } catch (error) {
    console.error('Error validando stock:', error)
    return {
      isValid: false,
      errors: ['Error interno validando stock'],
      warnings: []
    }
  }
}

// Obtener stock actual de un producto
export async function getProductStock(productId: string): Promise<ProductStock | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        stock: true,
        isAvailable: true
      }
    })

    if (!product) return null

    return {
      productId: product.id,
      name: product.name,
      currentStock: product.stock,
      requestedQuantity: 0,
      isAvailable: product.isAvailable
    }
  } catch (error) {
    console.error('Error obteniendo stock:', error)
    return null
  }
}

// Reservar stock temporalmente (para carrito)
export async function reserveStock(
  items: Array<{ productId: string; quantity: number }>,
  reservationId: string,
  expirationMinutes: number = 15
): Promise<boolean> {
  try {
    // En una implementación real, esto podría usar Redis o una tabla de reservas
    // Por ahora, solo validamos que hay stock disponible
    const validation = await validateProductStock(items)
    return validation.isValid
  } catch (error) {
    console.error('Error reservando stock:', error)
    return false
  }
}

// Liberar reserva de stock
export async function releaseStockReservation(reservationId: string): Promise<void> {
  try {
    // Implementar lógica de liberación de reserva
    console.log(`Liberando reserva: ${reservationId}`)
  } catch (error) {
    console.error('Error liberando reserva:', error)
  }
}

// Actualizar stock después de venta
export async function updateStockAfterSale(
  items: Array<{ productId: string; quantity: number }>
): Promise<void> {
  try {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }
    })
  } catch (error) {
    console.error('Error actualizando stock:', error)
    throw error
  }
}

// Obtener productos con stock bajo
export async function getLowStockProducts(threshold: number = 5): Promise<ProductStock[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: { lte: threshold },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        stock: true,
        isAvailable: true
      },
      orderBy: {
        stock: 'asc'
      }
    })

    return products.map(product => ({
      productId: product.id,
      name: product.name,
      currentStock: product.stock,
      requestedQuantity: 0,
      isAvailable: product.isAvailable
    }))
  } catch (error) {
    console.error('Error obteniendo productos con stock bajo:', error)
    return []
  }
} 