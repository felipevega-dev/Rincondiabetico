'use client'

import { MercadoPagoPayment } from '@/components/client/mercadopago-payment'

interface PaymentWrapperProps {
  orderId: string
  amount: number
}

export function PaymentWrapper({ orderId, amount }: PaymentWrapperProps) {
  const handleSuccess = (paymentId: string) => {
    window.location.href = `/checkout/success?payment=${paymentId}&order=${orderId}`
  }

  const handleError = (error: string) => {
    window.location.href = `/checkout/failure?error=${encodeURIComponent(error)}`
  }

  return (
    <MercadoPagoPayment
      orderId={orderId}
      amount={amount}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  )
} 