// Número de WhatsApp de la tienda (sin + ni espacios)
const WHATSAPP_NUMBER = '56986874406'

export interface WhatsAppMessageData {
  orderNumber?: string
  customerName?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
  total?: number
  pickupDate?: string
  pickupTime?: string
  customerNotes?: string
  type: 'order_confirmation' | 'payment_confirmation' | 'ready_pickup' | 'general_inquiry' | 'custom'
  customMessage?: string
}

// Generar mensaje de WhatsApp para pedidos
export function generateWhatsAppMessage(data: WhatsAppMessageData): string {
  switch (data.type) {
    case 'order_confirmation':
      return generateOrderConfirmationMessage(data)
    case 'payment_confirmation':
      return generatePaymentConfirmationMessage(data)
    case 'ready_pickup':
      return generateReadyPickupMessage(data)
    case 'general_inquiry':
      return generateGeneralInquiryMessage()
    case 'custom':
      return data.customMessage || 'Hola, necesito ayuda con mi pedido.'
    default:
      return 'Hola, necesito información sobre mis pedidos.'
  }
}

// Generar URL de WhatsApp
export function generateWhatsAppURL(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

// Generar mensaje de confirmación de pedido
function generateOrderConfirmationMessage(data: WhatsAppMessageData): string {
  const itemsList = data.items?.map(item => 
    `• ${item.name} x${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-CL')}`
  ).join('\n') || ''

  return `🍰 *Confirmación de Pedido*

Hola! He realizado un pedido y quería confirmar los detalles:

📋 *Pedido:* ${data.orderNumber || 'N/A'}
👤 *Cliente:* ${data.customerName || 'N/A'}

🛍️ *Productos:*
${itemsList}

💰 *Total:* $${data.total?.toLocaleString('es-CL') || 'N/A'}

📅 *Retiro:* ${data.pickupDate || 'N/A'} a las ${data.pickupTime || 'N/A'}

${data.customerNotes ? `📝 *Notas:* ${data.customerNotes}` : ''}

¿Podrían confirmar que todo está correcto?

¡Gracias! 😊`
}

// Generar mensaje de confirmación de pago
function generatePaymentConfirmationMessage(data: WhatsAppMessageData): string {
  return `💳 *Confirmación de Pago*

Hola! He realizado el pago para mi pedido:

📋 *Pedido:* ${data.orderNumber || 'N/A'}
👤 *Cliente:* ${data.customerName || 'N/A'}
💰 *Total:* $${data.total?.toLocaleString('es-CL') || 'N/A'}

He enviado el comprobante de transferencia. ¿Podrían confirmar que lo recibieron?

📅 *Retiro programado:* ${data.pickupDate || 'N/A'} a las ${data.pickupTime || 'N/A'}

¡Gracias! 😊`
}

// Generar mensaje para retiro listo
function generateReadyPickupMessage(data: WhatsAppMessageData): string {
  return `🎉 *Consulta sobre Retiro*

Hola! Quería confirmar si mi pedido está listo para retiro:

📋 *Pedido:* ${data.orderNumber || 'N/A'}
👤 *Cliente:* ${data.customerName || 'N/A'}
📅 *Retiro programado:* ${data.pickupDate || 'N/A'} a las ${data.pickupTime || 'N/A'}

¿Está listo para retirar?

¡Gracias! 😊`
}

// Generar mensaje de consulta general
function generateGeneralInquiryMessage(): string {
  return `👋 *Consulta General*

Hola! Tengo una consulta sobre:

• Productos disponibles
• Precios y promociones
• Horarios de atención
• Proceso de pedidos

¿Podrían ayudarme?

¡Gracias! 😊`
}

// Templates para el admin
export const ADMIN_WHATSAPP_TEMPLATES = {
  orderReceived: (orderNumber: string, customerName: string) => `
✅ *Pedido Recibido*

Hola ${customerName}!

Hemos recibido tu pedido #${orderNumber} correctamente.

Te contactaremos pronto con las instrucciones de pago.

¡Gracias por elegirnos! 🍰
  `.trim(),

  paymentConfirmed: (orderNumber: string, customerName: string, pickupDate: string, pickupTime: string) => `
💳 *Pago Confirmado*

Hola ${customerName}!

Tu pago para el pedido #${orderNumber} ha sido confirmado ✅

🎂 Ya comenzamos a preparar tu pedido
📅 Retiro: ${pickupDate} a las ${pickupTime}
📍 Dirección: Progreso 393, Chiguayante

¡Te esperamos! 😊
  `.trim(),

  orderReady: (orderNumber: string, customerName: string) => `
🎉 *¡Pedido Listo!*

Hola ${customerName}!

Tu pedido #${orderNumber} está listo para retiro 🎂

📍 Dirección: Progreso 393, Chiguayante
⏰ Horarios: Lun-Vie 9:00-19:00, Sáb 9:00-17:00, Dom 10:00-15:00

¡Te esperamos! 😊
  `.trim(),

  paymentReminder: (orderNumber: string, customerName: string, total: number) => `
⏰ *Recordatorio de Pago*

Hola ${customerName}!

Tu pedido #${orderNumber} está pendiente de pago.

💰 Total: $${total.toLocaleString('es-CL')}

Por favor, realiza la transferencia y envía el comprobante.

¡Gracias! 😊
  `.trim()
}

// Función para generar enlaces rápidos para el admin
export function generateAdminWhatsAppLinks(orderData: {
  orderNumber: string
  customerName: string
  customerPhone: string
  total: number
  pickupDate: string
  pickupTime: string
}) {
  const baseURL = `https://wa.me/${orderData.customerPhone.replace(/\D/g, '')}?text=`
  
  return {
    orderReceived: baseURL + encodeURIComponent(
      ADMIN_WHATSAPP_TEMPLATES.orderReceived(orderData.orderNumber, orderData.customerName)
    ),
    paymentConfirmed: baseURL + encodeURIComponent(
      ADMIN_WHATSAPP_TEMPLATES.paymentConfirmed(
        orderData.orderNumber, 
        orderData.customerName, 
        orderData.pickupDate, 
        orderData.pickupTime
      )
    ),
    orderReady: baseURL + encodeURIComponent(
      ADMIN_WHATSAPP_TEMPLATES.orderReady(orderData.orderNumber, orderData.customerName)
    ),
    paymentReminder: baseURL + encodeURIComponent(
      ADMIN_WHATSAPP_TEMPLATES.paymentReminder(
        orderData.orderNumber, 
        orderData.customerName, 
        orderData.total
      )
    )
  }
}

// Función para validar número de WhatsApp chileno
export function validateChileanWhatsApp(phone: string): boolean {
  // Remover todos los caracteres no numéricos
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Verificar formato chileno: 56 + 9 + 8 dígitos
  const chileanPattern = /^56[9][0-9]{8}$/
  
  return chileanPattern.test(cleanPhone)
}

// Función para formatear número chileno
export function formatChileanWhatsApp(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.startsWith('56')) {
    return cleanPhone
  } else if (cleanPhone.startsWith('9') && cleanPhone.length === 9) {
    return `56${cleanPhone}`
  } else if (cleanPhone.length === 8) {
    return `569${cleanPhone}`
  }
  
  return cleanPhone
} 