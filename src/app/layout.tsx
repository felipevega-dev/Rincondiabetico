import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { CartProvider } from '@/components/providers/cart-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { FloatingWhatsAppButton } from '@/components/client/whatsapp-buttons'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: 'Dulces Pasmiño - Postres Artesanales Sin Azúcar',
    template: '%s | Dulces Pasmiño'
  },
  description: 'Postres artesanales sin azúcar refinada, especialmente diseñados para personas con diabetes. Ubicados en Chiguayante, Chile.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${inter.variable} font-sans antialiased`}
        >
          <ToastProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <FloatingWhatsAppButton />
            </CartProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
