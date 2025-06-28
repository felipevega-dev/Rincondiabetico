import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { CheckoutForm } from '@/components/client/checkout-form'

export const metadata: Metadata = {
  title: 'Finalizar Pedido - Postres Pasmiño',
  description: 'Completa tu pedido y programa la fecha de retiro en nuestra tienda.',
}

export default async function CheckoutPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in?redirect_url=/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Finalizar Pedido
            </h1>
            <p className="text-lg text-gray-600">
              Completa la información para programar el retiro de tu pedido
            </p>
          </div>

          {/* Checkout Form */}
          <CheckoutForm />
        </div>
      </div>
    </div>
  )
} 