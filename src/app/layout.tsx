import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/shared/navbar'
import { ClerkProvider } from '@clerk/nextjs'
import { CartProvider } from '@/components/providers/cart-provider'
import { Toaster } from 'sonner'
import { clerkTranslations } from '@/lib/clerk-localization'
import { clerkConfig } from '@/lib/clerk-config'
import { Footer } from '@/components/shared/footer'
import { FloatingWhatsAppButton } from '@/components/client/whatsapp-buttons'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dulces Pasmiño - Postres y Tortas Sin Azúcar',
  description: 'Deliciosos postres y tortas sin azúcar, perfectos para diabéticos y personas que cuidan su salud. Retiro en tienda en Chiguayante.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider 
      localization={clerkTranslations}
      {...clerkConfig}
      appearance={{
        variables: {
          colorPrimary: '#ec4899',
          colorTextOnPrimaryBackground: 'white',
        },
        elements: {
          formButtonPrimary: 
            'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white',
          card: 'rounded-xl shadow-xl border-primary-100',
          socialButtonsIconButton: 'rounded-xl',
          formFieldInput: 'rounded-xl',
          dividerLine: 'bg-primary-100',
          dividerText: 'text-primary-500',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'rounded-xl',
          formFieldLabel: 'font-medium',
          footerActionLink: 'text-primary-600 hover:text-primary-700',
          identityPreviewEditButton: 'rounded-xl',
          formResendCodeLink: 'text-primary-600 hover:text-primary-700',
        },
      }}
    >
      <html lang="es">
        <body className={inter.className}>
          <CartProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
            <FloatingWhatsAppButton />
            <Toaster position="top-center" />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
