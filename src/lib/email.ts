import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  pickupDate?: string
  pickupTime?: string
  paymentMethod: string
}

export async function sendOrderStatusUpdateEmail(
  data: OrderEmailData & { 
    newStatus: string
    previousStatus?: string 
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const statusMessages = {
      'PREPARANDO': {
        title: 'Tu pedido está en preparación',
        message: 'Nuestro equipo ha comenzado a preparar tu pedido',
        icon: '👨‍🍳',
        color: '#f59e0b'
      },
      'LISTO': {
        title: '¡Tu pedido está listo!',
        message: 'Tu pedido está listo para retiro en nuestra tienda',
        icon: '✅',
        color: '#10b981'
      },
      'RETIRADO': {
        title: 'Pedido retirado exitosamente',
        message: 'Gracias por tu compra. ¡Esperamos verte pronto!',
        icon: '🎉',
        color: '#8b5cf6'
      },
      'CANCELADO': {
        title: 'Pedido cancelado',
        message: 'Tu pedido ha sido cancelado',
        icon: '❌',
        color: '#ef4444'
      }
    }

    const statusInfo = statusMessages[data.newStatus as keyof typeof statusMessages]
    if (!statusInfo) {
      throw new Error(`Estado no válido: ${data.newStatus}`)
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(price)
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Actualización de Pedido - Rincon Diabetico</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Rincon Diabetico</h1>
              <p style="color: #e8f5e7; margin: 5px 0 0 0; font-size: 16px;">Postres y Dulces Artesanales</p>
            </div>
            
            <!-- Status Update -->
            <div style="padding: 40px 30px; text-align: center; background-color: #f8f9fa;">
              <div style="background-color: ${statusInfo.color}; color: white; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 20px;">
                ${statusInfo.icon}
              </div>
              <h2 style="color: #2d5a27; margin: 0 0 10px 0; font-size: 24px;">${statusInfo.title}</h2>
              <p style="color: #666; margin: 0; font-size: 16px;">${statusInfo.message}</p>
            </div>

            <!-- Order Details -->
            <div style="padding: 30px;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #2d5a27; margin: 0 0 15px 0; font-size: 18px;">Detalles del Pedido</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Numero de pedido:</span>
                  <strong style="color: #2d5a27;">#${data.orderNumber}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Cliente:</span>
                  <strong>${data.customerName}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Total:</span>
                  <strong style="color: #2d5a27; font-size: 18px;">${formatPrice(data.total)}</strong>
                </div>
              </div>

              ${data.newStatus === 'LISTO' ? `
                <div style="background-color: #e8f5e7; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 30px;">
                  <h3 style="color: #2d5a27; margin: 0 0 15px 0; font-size: 18px;">Informacion de Retiro</h3>
                  <p style="margin: 0 0 10px 0;"><strong>Direccion:</strong> Progreso 393, Chiguayante, Region del Biobio</p>
                  ${data.pickupDate ? `<p style="margin: 0 0 10px 0;"><strong>Fecha programada:</strong> ${data.pickupDate}</p>` : ''}
                  ${data.pickupTime ? `<p style="margin: 0 0 10px 0;"><strong>Hora programada:</strong> ${data.pickupTime}</p>` : ''}
                  <p style="margin: 0; color: #666; font-style: italic;">Por favor trae una identificacion al momento del retiro.</p>
                </div>
              ` : ''}

              ${data.newStatus === 'PREPARANDO' ? `
                <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
                  <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">Tiempo Estimado</h3>
                  <p style="margin: 0; color: #92400e;">Tu pedido estara listo para retiro dentro de las proximas 2-4 horas. Te notificaremos cuando este disponible.</p>
                </div>
              ` : ''}
            </div>

            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <h3 style="color: #2d5a27; margin: 0 0 15px 0; font-size: 18px;">Contactanos</h3>
              <p style="margin: 0 0 10px 0; color: #666;">
                <strong>WhatsApp:</strong> +56 9 1234 5678
              </p>
              <p style="margin: 0 0 10px 0; color: #666;">
                <strong>Direccion:</strong> Progreso 393, Chiguayante
              </p>
              <p style="margin: 0; color: #666;">
                <strong>Email:</strong> contacto@rincondianetico.cl
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'Rincon Diabetico <pedidos@rincondianetico.cl>',
      to: data.customerEmail,
      subject: `${statusInfo.title} - Pedido #${data.orderNumber}`,
      html
    })

    console.log('Email de actualización enviado:', result)
    return { success: true }
  } catch (error) {
    console.error('Error enviando email de actualización:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

export async function sendPickupReminderEmail(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(price)
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Recordatorio de Retiro - Rincon Diabetico</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 30px 20px; text-align: center;">
              <div style="background-color: white; color: #f59e0b; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 20px;">
                ⏰
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Recordatorio de Retiro</h1>
              <p style="color: #fef3c7; margin: 5px 0 0 0; font-size: 16px;">Tu pedido te esta esperando</p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #2d5a27; margin: 0 0 20px 0; font-size: 24px;">¡No olvides retirar tu pedido!</h2>
              <p style="color: #666; margin: 0 0 30px 0; font-size: 16px;">
                Hola <strong>${data.customerName}</strong>, tu pedido <strong>#${data.orderNumber}</strong> 
                esta listo y programado para retiro hoy.
              </p>

              <!-- Pickup Info -->
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #2d5a27; margin: 0 0 20px 0; font-size: 20px;">Informacion de Retiro</h3>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #2d5a27;">Fecha:</strong> ${data.pickupDate || 'Hoy'}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #2d5a27;">Hora:</strong> ${data.pickupTime || 'Horario comercial'}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #2d5a27;">Direccion:</strong> Progreso 393, Chiguayante, Region del Biobio
                </div>
                <div>
                  <strong style="color: #2d5a27;">Total a pagar:</strong> 
                  <span style="font-size: 20px; color: #f59e0b;">${formatPrice(data.total)}</span>
                </div>
              </div>

              <!-- Important Notes -->
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">Importante</h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400e; text-align: left;">
                  <li>Trae una identificacion valida</li>
                  <li>Menciona tu numero de pedido: <strong>#${data.orderNumber}</strong></li>
                  <li>El pago se realiza al momento del retiro</li>
                </ul>
              </div>
            </div>

            <!-- Contact -->
            <div style="background-color: #2d5a27; padding: 30px; text-align: center;">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px;">¿Necesitas ayuda?</h3>
              <p style="margin: 0 0 15px 0; color: #e8f5e7;">
                Contactanos por WhatsApp: <strong>+56 9 1234 5678</strong>
              </p>
              <a href="https://wa.me/56912345678?text=Hola, tengo una consulta sobre mi pedido ${data.orderNumber}" 
                 style="background-color: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'Rincon Diabetico <pedidos@rincondianetico.cl>',
      to: data.customerEmail,
      subject: `Recordatorio: Retira tu pedido #${data.orderNumber} hoy`,
      html
    })

    console.log('Email de recordatorio enviado:', result)
    return { success: true }
  } catch (error) {
    console.error('Error enviando email de recordatorio:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(price)
    }

    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
      </tr>
    `).join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmacion de Pedido - Rincon Diabetico</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <header style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d5a27; margin: 0;">Rincon Diabetico</h1>
              <p style="color: #666; margin: 5px 0;">Postres y Dulces Artesanales</p>
            </header>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2d5a27; margin-top: 0;">Pedido Confirmado!</h2>
              <p>Hola <strong>${data.customerName}</strong>,</p>
              <p>Hemos recibido tu pedido <strong>#${data.orderNumber}</strong> exitosamente.</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 5px;">Detalles del Pedido</h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2d5a27;">Producto</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #2d5a27;">Cantidad</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #2d5a27;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div style="text-align: right; margin-top: 20px;">
                <strong style="font-size: 18px; color: #2d5a27;">
                  Total: ${formatPrice(data.total)}
                </strong>
              </div>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 5px;">Informacion de Retiro</h3>
              ${data.pickupDate ? `<p><strong>Fecha de retiro:</strong> ${data.pickupDate}</p>` : ''}
              ${data.pickupTime ? `<p><strong>Hora de retiro:</strong> ${data.pickupTime}</p>` : ''}
              <p><strong>Metodo de pago:</strong> ${data.paymentMethod === 'MERCADOPAGO' ? 'MercadoPago' : 'Transferencia Bancaria'}</p>
              <p><strong>Direccion:</strong> Progreso 393, Chiguayante, Region del Biobio</p>
            </div>

            <footer style="text-align: center; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #666; margin: 0;">
                <strong>Rincon Diabetico</strong><br>
                Progreso 393, Chiguayante<br>
                WhatsApp: +56 9 1234 5678
              </p>
            </footer>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'Rincon Diabetico <pedidos@rincondianetico.cl>',
      to: data.customerEmail,
      subject: `Confirmacion de Pedido #${data.orderNumber} - Rincon Diabetico`,
      html
    })

    console.log('Email enviado:', result)
    return { success: true }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}