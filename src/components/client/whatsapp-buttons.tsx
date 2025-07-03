'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  generateWhatsAppMessage, 
  generateWhatsAppURL, 
  WhatsAppMessageData 
} from '@/lib/whatsapp'

const WhatsAppIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.506z"/>
  </svg>
)

interface WhatsAppButtonProps {
  data: WhatsAppMessageData
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function WhatsAppButton({ 
  data, 
  variant = 'default', 
  size = 'default',
  className = '',
  children 
}: WhatsAppButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleClick = async () => {
    setIsGenerating(true)
    
    try {
      const message = generateWhatsAppMessage(data)
      const whatsappURL = generateWhatsAppURL(message)
      
      // Abrir WhatsApp en nueva ventana
      window.open(whatsappURL, '_blank')
    } catch (error) {
      console.error('Error generando mensaje de WhatsApp:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Generando...
        </>
      ) : (
        <>
          {children || (
            <span className='flex items-center justify-center'>
              <WhatsAppIcon className="mr-2" />
              Contactar por WhatsApp
            </span>
          )}
        </>
      )}
    </Button>
  )
}

// Botón para confirmación de pedido
export function OrderConfirmationWhatsApp({ 
  orderNumber, 
  customerName, 
  items, 
  total, 
  pickupDate, 
  pickupTime, 
  customerNotes 
}: {
  orderNumber: string
  customerName: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  pickupDate: string
  pickupTime: string
  customerNotes?: string
}) {
  return (
    <WhatsAppButton
      data={{
        type: 'order_confirmation',
        orderNumber,
        customerName,
        items,
        total,
        pickupDate,
        pickupTime,
        customerNotes
      }}
      size="lg"
      className="w-full"
    >
      <span className='flex items-center justify-center'>
        <WhatsAppIcon className="mr-2" />
        📱 Confirmar Pedido por WhatsApp
      </span>
    </WhatsAppButton>
  )
}

// Botón para confirmación de pago
export function PaymentConfirmationWhatsApp({ 
  orderNumber, 
  customerName, 
  total, 
  pickupDate, 
  pickupTime 
}: {
  orderNumber: string
  customerName: string
  total: number
  pickupDate: string
  pickupTime: string
}) {
  return (
    <WhatsAppButton
      data={{
        type: 'payment_confirmation',
        orderNumber,
        customerName,
        total,
        pickupDate,
        pickupTime
      }}
      variant="outline"
      className="border-green-600 text-green-600 hover:bg-green-50"
    >
      <span className='flex items-center justify-center'>
        <WhatsAppIcon className="mr-2" />
        💳 Confirmar Pago por WhatsApp
      </span>
    </WhatsAppButton>
  )
}

// Botón para consulta sobre retiro
export function ReadyPickupWhatsApp({ 
  orderNumber, 
  customerName, 
  pickupDate, 
  pickupTime 
}: {
  orderNumber: string
  customerName: string
  pickupDate: string
  pickupTime: string
}) {
  return (
    <WhatsAppButton
      data={{
        type: 'ready_pickup',
        orderNumber,
        customerName,
        pickupDate,
        pickupTime
      }}
      variant="secondary"
    >
      <span className='flex items-center justify-center'>
        <WhatsAppIcon className="mr-2" />
        🎉 Consultar Estado del Pedido
      </span>
    </WhatsAppButton>
  )
}

// Botón para consulta general
export function GeneralInquiryWhatsApp({ 
  className = '' 
}: { 
  className?: string 
}) {
  return (
    <WhatsAppButton
      data={{ type: 'general_inquiry' }}
      className={className}
    >
      <span className='flex items-center justify-center'>
        <WhatsAppIcon className="mr-2" />
        💬 Consultar por WhatsApp
      </span>
    </WhatsAppButton>
  )
}

// Botón flotante de WhatsApp
export function FloatingWhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <WhatsAppButton
        data={{ type: 'general_inquiry' }}
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-bounce w-14 h-14 p-0"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </WhatsAppButton>
    </div>
  )
}

// Componente para mostrar múltiples opciones de WhatsApp
export function WhatsAppOptionsMenu({ 
  orderData 
}: { 
  orderData?: {
    orderNumber: string
    customerName: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    pickupDate: string
    pickupTime: string
    customerNotes?: string
  }
}) {
  if (!orderData) {
    return <GeneralInquiryWhatsApp />
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Contactar por WhatsApp:</h3>
      
      <div className="grid gap-2">
        <OrderConfirmationWhatsApp {...orderData} />
        
        <div className="grid grid-cols-2 gap-2">
          <PaymentConfirmationWhatsApp 
            orderNumber={orderData.orderNumber}
            customerName={orderData.customerName}
            total={orderData.total}
            pickupDate={orderData.pickupDate}
            pickupTime={orderData.pickupTime}
          />
          
          <ReadyPickupWhatsApp 
            orderNumber={orderData.orderNumber}
            customerName={orderData.customerName}
            pickupDate={orderData.pickupDate}
            pickupTime={orderData.pickupTime}
          />
        </div>
      </div>
    </div>
  )
} 