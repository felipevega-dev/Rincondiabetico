import { OrderEmailData } from './email'

// Configuración de WhatsApp
const ADMIN_WHATSAPP_NUMBER = '+56912345678' // Número del admin
const STORE_WHATSAPP_NUMBER = '+56912345678' // Número de la tienda

interface WhatsAppMessage {
  to: string
  message: string
  type: 'new_order' | 'status_update' | 'reminder' | 'alert'
}

interface WhatsAppNotificationSettings {
  newOrders: boolean
  statusUpdates: boolean
  lowStock: boolean
  systemAlerts: boolean
}

/**
 * Genera mensaje de WhatsApp para nuevo pedido
 */
export function generateNewOrderMessage(data: OrderEmailData): string {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const itemsList = data.items.map(item => 
    `• ${item.name} x${item.quantity} - ${formatPrice(item.price)}`
  ).join('\n')

  return `🔔 *NUEVO PEDIDO RECIBIDO* 🔔

📋 *Pedido:* #${data.orderNumber}
👤 *Cliente:* ${data.customerName}
📧 *Email:* ${data.customerEmail}
💰 *Total:* ${formatPrice(data.total)}
💳 *Pago:* ${data.paymentMethod === 'MERCADOPAGO' ? 'MercadoPago' : 'Transferencia Bancaria'}

📦 *PRODUCTOS:*
${itemsList}

📅 *Retiro programado:*
${data.pickupDate ? `Fecha: ${data.pickupDate}` : 'Sin fecha específica'}
${data.pickupTime ? `Hora: ${data.pickupTime}` : 'Horario comercial'}

🏪 *Rincón Diabético*
Progreso 393, Chiguayante`
}

/**
 * Genera mensaje de WhatsApp para cambio de estado
 */
export function generateStatusUpdateMessage(
  data: OrderEmailData & { newStatus: string; previousStatus?: string }
): string {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const statusEmojis = {
    'PREPARANDO': '👨‍🍳',
    'LISTO': '✅',
    'RETIRADO': '🎉',
    'CANCELADO': '❌'
  }

  const statusNames = {
    'PREPARANDO': 'EN PREPARACIÓN',
    'LISTO': 'LISTO PARA RETIRO',
    'RETIRADO': 'RETIRADO',
    'CANCELADO': 'CANCELADO'
  }

  const emoji = statusEmojis[data.newStatus as keyof typeof statusEmojis] || '📝'
  const statusName = statusNames[data.newStatus as keyof typeof statusNames] || data.newStatus

  return `${emoji} *ACTUALIZACIÓN DE PEDIDO* ${emoji}

📋 *Pedido:* #${data.orderNumber}
👤 *Cliente:* ${data.customerName}
💰 *Total:* ${formatPrice(data.total)}

📊 *Estado actualizado:* ${statusName}
${data.previousStatus ? `(Anterior: ${data.previousStatus})` : ''}

${data.newStatus === 'LISTO' ? `
📅 *Información de retiro:*
${data.pickupDate ? `Fecha: ${data.pickupDate}` : 'Hoy'}
${data.pickupTime ? `Hora: ${data.pickupTime}` : 'Horario comercial'}
📍 Progreso 393, Chiguayante

⚠️ *Recordar al cliente traer identificación*
` : ''}

🏪 *Rincón Diabético*`
}

/**
 * Genera mensaje de WhatsApp para alerta de stock bajo
 */
export function generateLowStockAlert(products: Array<{ name: string; stock: number; category: string }>): string {
  const productList = products.map(product => 
    `• ${product.name} (${product.category}): ${product.stock} unidades`
  ).join('\n')

  return `⚠️ *ALERTA DE STOCK BAJO* ⚠️

Los siguientes productos necesitan reposición:

${productList}

🏪 *Rincón Diabético*
📱 Revisar inventario en admin panel`
}

/**
 * Genera enlace de WhatsApp para enviar mensaje
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message)
  const cleanPhone = phoneNumber.replace(/\D/g, '') // Remover caracteres no numéricos
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Simula envío de WhatsApp (en producción sería integración con API real)
 */
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<{ success: boolean; error?: string }> {
  try {
    // En desarrollo, solo generamos el enlace
    const link = generateWhatsAppLink(message.to, message.message)
    
    console.log(`📱 WhatsApp ${message.type}:`)
    console.log(`Para: ${message.to}`)
    console.log(`Enlace: ${link}`)
    console.log(`Mensaje:\n${message.message}`)
    
    // En producción aquí iría la integración real con WhatsApp Business API
    // await whatsappAPI.sendMessage(message.to, message.message)
    
    return { success: true }
  } catch (error) {
    console.error('Error enviando WhatsApp:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Notifica nuevo pedido al admin por WhatsApp
 */
export async function notifyNewOrderToAdmin(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  const message = generateNewOrderMessage(data)
  
  return await sendWhatsAppMessage({
    to: ADMIN_WHATSAPP_NUMBER,
    message,
    type: 'new_order'
  })
}

/**
 * Notifica cambio de estado al admin por WhatsApp
 */
export async function notifyStatusUpdateToAdmin(
  data: OrderEmailData & { newStatus: string; previousStatus?: string }
): Promise<{ success: boolean; error?: string }> {
  const message = generateStatusUpdateMessage(data)
  
  return await sendWhatsAppMessage({
    to: ADMIN_WHATSAPP_NUMBER,
    message,
    type: 'status_update'
  })
}

/**
 * Notifica stock bajo al admin por WhatsApp
 */
export async function notifyLowStockToAdmin(
  products: Array<{ name: string; stock: number; category: string }>
): Promise<{ success: boolean; error?: string }> {
  if (products.length === 0) return { success: true }
  
  const message = generateLowStockAlert(products)
  
  return await sendWhatsAppMessage({
    to: ADMIN_WHATSAPP_NUMBER,
    message,
    type: 'alert'
  })
}

/**
 * Genera enlace de WhatsApp para que el cliente contacte a la tienda
 */
export function generateCustomerWhatsAppLink(orderNumber: string, customerMessage?: string): string {
  const defaultMessage = `Hola, tengo una consulta sobre mi pedido #${orderNumber}`
  const message = customerMessage || defaultMessage
  
  return generateWhatsAppLink(STORE_WHATSAPP_NUMBER, message)
}

/**
 * Configuración de notificaciones WhatsApp
 */
export class WhatsAppNotificationManager {
  private settings: WhatsAppNotificationSettings = {
    newOrders: true,
    statusUpdates: true,
    lowStock: true,
    systemAlerts: true
  }

  updateSettings(newSettings: Partial<WhatsAppNotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings }
    console.log('Configuración WhatsApp actualizada:', this.settings)
  }

  getSettings(): WhatsAppNotificationSettings {
    return { ...this.settings }
  }

  async sendNewOrderNotification(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
    if (!this.settings.newOrders) {
      console.log('Notificaciones de nuevos pedidos deshabilitadas')
      return { success: true }
    }

    return await notifyNewOrderToAdmin(data)
  }

  async sendStatusUpdateNotification(
    data: OrderEmailData & { newStatus: string; previousStatus?: string }
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.settings.statusUpdates) {
      console.log('Notificaciones de cambio de estado deshabilitadas')
      return { success: true }
    }

    return await notifyStatusUpdateToAdmin(data)
  }

  async sendLowStockNotification(
    products: Array<{ name: string; stock: number; category: string }>
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.settings.lowStock) {
      console.log('Notificaciones de stock bajo deshabilitadas')
      return { success: true }
    }

    return await notifyLowStockToAdmin(products)
  }
}

// Instancia global del manager
export const whatsappManager = new WhatsAppNotificationManager()