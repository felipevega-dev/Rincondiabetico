import { prisma } from './prisma'

// Configuración de limpieza
const DRAFT_ORDER_EXPIRATION_MINUTES = 15 // 15 minutos para órdenes draft
const PENDING_ORDER_EXPIRATION_HOURS = 24 // 24 horas para órdenes pendientes sin pago

export interface CleanupResult {
  deletedDraftOrders: number
  expiredPendingOrders: number
  errors: string[]
}

/**
 * Limpia órdenes draft abandonadas (más de 15 minutos)
 * y órdenes pendientes sin pago (más de 24 horas)
 */
export async function cleanupAbandonedOrders(): Promise<CleanupResult> {
  const result: CleanupResult = {
    deletedDraftOrders: 0,
    expiredPendingOrders: 0,
    errors: []
  }

  try {
    // Calcular fechas de expiración
    const draftExpirationDate = new Date()
    draftExpirationDate.setMinutes(draftExpirationDate.getMinutes() - DRAFT_ORDER_EXPIRATION_MINUTES)

    const pendingExpirationDate = new Date()
    pendingExpirationDate.setHours(pendingExpirationDate.getHours() - PENDING_ORDER_EXPIRATION_HOURS)

    // 1. Eliminar órdenes DRAFT expiradas (15+ minutos)
    try {
      const draftOrdersToDelete = await prisma.order.findMany({
        where: {
          status: 'DRAFT',
          createdAt: {
            lt: draftExpirationDate
          }
        },
        include: {
          items: true,
          payment: true
        }
      })

      if (draftOrdersToDelete.length > 0) {
        // Usar transacción para eliminar todo relacionado
        await prisma.$transaction(async (tx) => {
          for (const order of draftOrdersToDelete) {
            // Eliminar variaciones de items
            await tx.orderItemVariation.deleteMany({
              where: {
                orderItem: {
                  orderId: order.id
                }
              }
            })

            // Eliminar items
            await tx.orderItem.deleteMany({
              where: {
                orderId: order.id
              }
            })

            // Eliminar payment si existe
            if (order.payment) {
              await tx.payment.delete({
                where: {
                  orderId: order.id
                }
              })
            }

            // Eliminar la orden
            await tx.order.delete({
              where: {
                id: order.id
              }
            })
          }
        })

        result.deletedDraftOrders = draftOrdersToDelete.length
        console.log(`🧹 Limpieza: ${draftOrdersToDelete.length} órdenes DRAFT eliminadas`)
      }
    } catch (error) {
      const errorMsg = `Error eliminando órdenes DRAFT: ${error instanceof Error ? error.message : 'Error desconocido'}`
      result.errors.push(errorMsg)
      console.error(errorMsg)
    }

    // 2. Cancelar órdenes PENDIENTE expiradas (24+ horas) 
    try {
      const expiredPendingOrders = await prisma.order.updateMany({
        where: {
          status: 'PENDIENTE',
          createdAt: {
            lt: pendingExpirationDate
          }
        },
        data: {
          status: 'CANCELADO',
          adminNotes: 'Cancelado automáticamente por expiración (24h sin pago)'
        }
      })

      result.expiredPendingOrders = expiredPendingOrders.count
      if (expiredPendingOrders.count > 0) {
        console.log(`⏰ Limpieza: ${expiredPendingOrders.count} órdenes PENDIENTE canceladas por expiración`)
      }
    } catch (error) {
      const errorMsg = `Error cancelando órdenes PENDIENTE: ${error instanceof Error ? error.message : 'Error desconocido'}`
      result.errors.push(errorMsg)
      console.error(errorMsg)
    }

    return result
  } catch (error) {
    const errorMsg = `Error general en limpieza: ${error instanceof Error ? error.message : 'Error desconocido'}`
    result.errors.push(errorMsg)
    console.error(errorMsg)
    return result
  }
}

/**
 * Obtiene estadísticas de órdenes que necesitan limpieza
 */
export async function getCleanupStats() {
  try {
    const draftExpirationDate = new Date()
    draftExpirationDate.setMinutes(draftExpirationDate.getMinutes() - DRAFT_ORDER_EXPIRATION_MINUTES)

    const pendingExpirationDate = new Date()
    pendingExpirationDate.setHours(pendingExpirationDate.getHours() - PENDING_ORDER_EXPIRATION_HOURS)

    const [expiredDraftCount, expiredPendingCount, totalDraftCount, totalPendingCount] = await Promise.all([
      prisma.order.count({
        where: {
          status: 'DRAFT',
          createdAt: { lt: draftExpirationDate }
        }
      }),
      prisma.order.count({
        where: {
          status: 'PENDIENTE',
          createdAt: { lt: pendingExpirationDate }
        }
      }),
      prisma.order.count({
        where: { status: 'DRAFT' }
      }),
      prisma.order.count({
        where: { status: 'PENDIENTE' }
      })
    ])

    return {
      expiredDraftOrders: expiredDraftCount,
      expiredPendingOrders: expiredPendingCount,
      totalDraftOrders: totalDraftCount,
      totalPendingOrders: totalPendingCount,
      needsCleanup: expiredDraftCount > 0 || expiredPendingCount > 0
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de limpieza:', error)
    return {
      expiredDraftOrders: 0,
      expiredPendingOrders: 0,
      totalDraftOrders: 0,
      totalPendingOrders: 0,
      needsCleanup: false
    }
  }
}

/**
 * Programa la limpieza automática (para usar en cron jobs o background tasks)
 */
export function scheduleCleanup() {
  // Ejecutar limpieza cada 30 minutos
  const interval = 30 * 60 * 1000 // 30 minutos en milisegundos
  
  setInterval(async () => {
    try {
      const result = await cleanupAbandonedOrders()
      if (result.deletedDraftOrders > 0 || result.expiredPendingOrders > 0 || result.errors.length > 0) {
        console.log('🧹 Limpieza programada ejecutada:', result)
      }
    } catch (error) {
      console.error('Error en limpieza programada:', error)
    }
  }, interval)

  console.log(`🕒 Limpieza automática programada cada ${interval / 60000} minutos`)
}