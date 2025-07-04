import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  pickupDate: string
  pickupTime: string
  customerNotes?: string
  status: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Template para confirmación de pedido
export function getOrderConfirmationTemplate(data: OrderEmailData): EmailTemplate {
  const itemsList = data.items
    .map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toLocaleString('es-CL')}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString('es-CL')}</td>
      </tr>
    `)
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido - Postres Pasmiño</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ec4899, #f97316); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">¡Pedido Confirmado!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Postres Pasmiño</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hola <strong>${data.customerName}</strong>,</p>
        
        <p>¡Gracias por tu pedido! Hemos recibido tu solicitud y está siendo procesada.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #ec4899;">📋 Detalles del Pedido</h3>
          <p><strong>Número de Pedido:</strong> ${data.orderNumber}</p>
          <p><strong>Fecha de Retiro:</strong> ${data.pickupDate}</p>
          <p><strong>Hora de Retiro:</strong> ${data.pickupTime}</p>
          ${data.customerNotes ? `<p><strong>Notas:</strong> ${data.customerNotes}</p>` : ''}
        </div>

        <h3 style="color: #ec4899;">🍰 Productos Pedidos</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #ddd;">Producto</th>
              <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #ddd;">Cantidad</th>
              <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Precio Unit.</th>
              <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td colspan="3" style="padding: 12px 8px; border-top: 2px solid #ddd;">TOTAL</td>
              <td style="padding: 12px 8px; text-align: right; border-top: 2px solid #ddd; color: #ec4899;">$${data.total.toLocaleString('es-CL')}</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #856404;">📍 Información de Retiro</h4>
          <p style="margin-bottom: 5px;"><strong>Dirección:</strong> Progreso 393, Chiguayante, Región del Biobío</p>
          <p style="margin-bottom: 5px;"><strong>Horarios:</strong></p>
          <ul style="margin: 5px 0;">
            <li>Lunes a Viernes: 9:00 - 19:00</li>
            <li>Sábados: 9:00 - 17:00</li>
            <li>Domingos: 10:00 - 15:00</li>
          </ul>
        </div>

        <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #0c5460;">💳 Estado del Pago</h4>
          <p>Estado actual: <strong>${getStatusLabel(data.status)}</strong></p>
          ${data.status === 'PENDIENTE' ? `
            <p>⏳ Tu pedido está pendiente de pago. Te contactaremos pronto con las instrucciones.</p>
          ` : data.status === 'ESPERANDO_CONFIRMACION' ? `
            <p>📄 Hemos recibido tu comprobante de transferencia y estamos verificando el pago.</p>
          ` : ''}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/56986874406" style="display: inline-block; background: #25d366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            💬 Contactar por WhatsApp
          </a>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          Si tienes alguna pregunta, no dudes en contactarnos.<br>
          <strong>WhatsApp:</strong> +56 9 8687 4406<br>
          <strong>Email:</strong> contacto@rincondiabetico.cl
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
¡Pedido Confirmado! - Postres Pasmiño

Hola ${data.customerName},

¡Gracias por tu pedido! Hemos recibido tu solicitud y está siendo procesada.

DETALLES DEL PEDIDO:
- Número de Pedido: ${data.orderNumber}
- Fecha de Retiro: ${data.pickupDate}
- Hora de Retiro: ${data.pickupTime}
${data.customerNotes ? `- Notas: ${data.customerNotes}` : ''}

PRODUCTOS PEDIDOS:
${data.items.map(item => `- ${item.name} x${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-CL')}`).join('\n')}

TOTAL: $${data.total.toLocaleString('es-CL')}

INFORMACIÓN DE RETIRO:
Dirección: Progreso 393, Chiguayante, Región del Biobío
Horarios:
- Lunes a Viernes: 9:00 - 19:00
- Sábados: 9:00 - 17:00
- Domingos: 10:00 - 15:00

Estado del Pago: ${getStatusLabel(data.status)}

WhatsApp: +56 9 8687 4406
Email: contacto@rincondiabetico.cl

¡Gracias por elegirnos!
Postres Pasmiño
  `

  return {
    subject: `Confirmación de Pedido #${data.orderNumber} - Postres Pasmiño`,
    html,
    text
  }
}

// Función para enviar email de confirmación
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const template = getOrderConfirmationTemplate(data)
    
    const result = await resend.emails.send({
      from: 'Postres Pasmiño <pedidos@rincondiabetico.cl>',
      to: [data.customerEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log('Email enviado:', result)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

// Funciones helper
function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'DRAFT': 'Borrador',
    'PENDIENTE': 'Pendiente de Pago',
    'ESPERANDO_CONFIRMACION': 'Esperando Confirmación',
    'PAGADO': 'Pagado',
    'PREPARANDO': 'En Preparación',
    'LISTO': 'Listo para Retiro',
    'RETIRADO': 'Retirado',
    'CANCELADO': 'Cancelado'
  }
  return statusMap[status] || status
}
