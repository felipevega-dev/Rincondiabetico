import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pago Seguro - Postres Pasmiño',
  description: 'Completa tu pago de forma segura con MercadoPago.',
}

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 