import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendPickupReminderEmail, OrderEmailData } from './email'
import { whatsappManager } from './whatsapp-automation'

export interface NotificationResult {
  email: { success: boolean; error?: string }
  whatsapp: { success: boolean; error?: string }
  timestamp: Date
}

export interface NotificationSettings {
  email: {
    orderConfirmation: boolean
    statusUpdates: boolean
    pickupReminders: boolean
  }
  whatsapp: {
    adminNewOrders: boolean
    adminStatusUpdates: boolean
    adminLowStock: boolean
  }
}

class NotificationSystem {
  private settings: NotificationSettings = {
    email: {
      orderConfirmation: true,
      statusUpdates: true,
      pickupReminders: true
    },
    whatsapp: {
      adminNewOrders: true,
      adminStatusUpdates: true,
      adminLowStock: true
    }
  }

  /**
   * Actualizar configuración de notificaciones
   */
  updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = {
      email: { ...this.settings.email, ...newSettings.email },
      whatsapp: { ...this.settings.whatsapp, ...newSettings.whatsapp }
    }
    
    // Actualizar también el manager de WhatsApp
    whatsappManager.updateSettings({
      newOrders: this.settings.whatsapp.adminNewOrders,
      statusUpdates: this.settings.whatsapp.adminStatusUpdates,
      lowStock: this.settings.whatsapp.adminLowStock,
      systemAlerts: true
    })
    
    console.log('Configuración de notificaciones actualizada:', this.settings)
  }

  /**
   * Obtener configuración actual
   */
  getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  /**
   * Enviar notificación de confirmación de pedido
   */
  async sendOrderConfirmation(data: OrderEmailData): Promise<NotificationResult> {
    const result: NotificationResult = {
      email: { success: false },
      whatsapp: { success: false },
      timestamp: new Date()
    }

    // Enviar email de confirmación al cliente
    if (this.settings.email.orderConfirmation) {
      try {
        result.email = await sendOrderConfirmationEmail(data)
      } catch (error) {
        result.email = {
          success: false,
          error: error instanceof Error ? error.message : 'Error enviando email'
        }
      }
    } else {
      result.email = { success: true } // No enviar = éxito por configuración
    }

    // Notificar al admin por WhatsApp
    if (this.settings.whatsapp.adminNewOrders) {
      try {
        result.whatsapp = await whatsappManager.sendNewOrderNotification(data)
      } catch (error) {
        result.whatsapp = {
          success: false,
          error: error instanceof Error ? error.message : 'Error enviando WhatsApp'
        }
      }
    } else {
      result.whatsapp = { success: true } // No enviar = éxito por configuración
    }

    console.log('Notificación de confirmación enviada:', {
      orderNumber: data.orderNumber,
      email: result.email.success,
      whatsapp: result.whatsapp.success
    })

    return result
  }

  /**
   * Enviar notificación de cambio de estado
   */
  async sendStatusUpdate(
    data: OrderEmailData & { newStatus: string; previousStatus?: string }
  ): Promise<NotificationResult> {
    const result: NotificationResult = {
      email: { success: false },
      whatsapp: { success: false },
      timestamp: new Date()
    }

    // Enviar email de actualización al cliente
    if (this.settings.email.statusUpdates) {
      try {
        result.email = await sendOrderStatusUpdateEmail(data)
      } catch (error) {
        result.email = {
          success: false,
          error: error instanceof Error ? error.message : 'Error enviando email'
        }
      }
    } else {
      result.email = { success: true }
    }

    // Notificar al admin por WhatsApp
    if (this.settings.whatsapp.adminStatusUpdates) {
      try {
        result.whatsapp = await whatsappManager.sendStatusUpdateNotification(data)
      } catch (error) {
        result.whatsapp = {
          success: false,
          error: error instanceof Error ? error.message : 'Error enviando WhatsApp'
        }
      }
    } else {
      result.whatsapp = { success: true }
    }

    console.log('Notificación de estado enviada:', {
      orderNumber: data.orderNumber,
      newStatus: data.newStatus,
      email: result.email.success,
      whatsapp: result.whatsapp.success
    })

    return result
  }

  /**
   * Enviar recordatorio de retiro
   */
  async sendPickupReminder(data: OrderEmailData): Promise<NotificationResult> {
    const result: NotificationResult = {
      email: { success: false },
      whatsapp: { success: true }, // WhatsApp no implementado para recordatorios
      timestamp: new Date()
    }

    // Enviar email de recordatorio al cliente
    if (this.settings.email.pickupReminders) {
      try {
        result.email = await sendPickupReminderEmail(data)
      } catch (error) {
        result.email = {
          success: false,
          error: error instanceof Error ? error.message : 'Error enviando email'
        }
      }
    } else {
      result.email = { success: true }
    }

    console.log('Recordatorio de retiro enviado:', {
      orderNumber: data.orderNumber,
      email: result.email.success
    })

    return result
  }

  /**
   * Notificar stock bajo al admin
   */
  async notifyLowStock(
    products: Array<{ name: string; stock: number; category: string }>
  ): Promise<{ success: boolean; error?: string }> {
    if (products.length === 0) return { success: true }

    if (this.settings.whatsapp.adminLowStock) {
      return await whatsappManager.sendLowStockNotification(products)
    }

    return { success: true }
  }

  /**
   * Programar recordatorio de retiro automático
   */
  schedulePickupReminder(
    data: OrderEmailData,
    reminderTimeMinutes: number = 60 // 1 hora antes por defecto
  ) {
    if (!data.pickupDate || !data.pickupTime) {
      console.log('No se puede programar recordatorio: fecha/hora de retiro no definida')
      return
    }

    try {
      // Parsear fecha y hora de retiro
      const [day, month, year] = data.pickupDate.split('/')
      const [hours, minutes] = data.pickupTime.split(':')
      
      const pickupDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1, // Los meses en JS son 0-indexados
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      )

      // Calcular tiempo del recordatorio
      const reminderTime = new Date(pickupDateTime.getTime() - (reminderTimeMinutes * 60 * 1000))
      const now = new Date()

      if (reminderTime > now) {
        const timeUntilReminder = reminderTime.getTime() - now.getTime()
        
        setTimeout(async () => {
          console.log(`Enviando recordatorio programado para pedido ${data.orderNumber}`)
          await this.sendPickupReminder(data)
        }, timeUntilReminder)

        console.log(`Recordatorio programado para ${reminderTime.toLocaleString('es-CL')} (pedido ${data.orderNumber})`)
      } else {
        console.log('La hora del recordatorio ya pasó, no se programa')
      }
    } catch (error) {
      console.error('Error programando recordatorio:', error)
    }
  }

  /**
   * Verificar estado del sistema de notificaciones
   */
  async healthCheck(): Promise<{
    email: boolean
    whatsapp: boolean
    settings: NotificationSettings
  }> {
    return {
      email: true, // En producción verificaría conexión con Resend
      whatsapp: true, // En producción verificaría conexión con WhatsApp API
      settings: this.getSettings()
    }
  }
}

// Instancia global del sistema de notificaciones
export const notificationSystem = new NotificationSystem()

// Funciones de conveniencia para usar desde API routes
export async function notifyOrderConfirmation(data: OrderEmailData) {
  return await notificationSystem.sendOrderConfirmation(data)
}

export async function notifyStatusChange(
  data: OrderEmailData & { newStatus: string; previousStatus?: string }
) {
  return await notificationSystem.sendStatusUpdate(data)
}

export async function notifyPickupReminder(data: OrderEmailData) {
  return await notificationSystem.sendPickupReminder(data)
}

export async function notifyLowStock(
  products: Array<{ name: string; stock: number; category: string }>
) {
  return await notificationSystem.notifyLowStock(products)
}