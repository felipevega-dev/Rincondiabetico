'use client'

import { PaymentOptions } from '@/components/client/payment-options'

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
    <PaymentOptions
      orderId={orderId}
      amount={amount}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  )
} 