'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { PaymentWrapper } from './payment-wrapper'

export default function PaymentPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isReady, setIsReady] = useState(false)

  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push('/sign-in?redirect_url=/checkout/payment')
        return
      }

      if (!orderId || !amount) {
        router.push('/checkout')
        return
      }

      setIsReady(true)
    }
  }, [isLoaded, user, orderId, amount, router])

  if (!isLoaded || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pago Seguro
            </h1>
            <p className="text-lg text-gray-600">
              Completa tu pago de forma segura con MercadoPago
            </p>
          </div>

          {/* Payment Form */}
          <PaymentWrapper
            orderId={orderId!}
            amount={parseInt(amount!)}
          />
        </div>
      </div>
    </div>
  )
} 