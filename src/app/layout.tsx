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
  title: "Rincón Diabético - Postres Artesanales",
  description: "Deliciosos postres artesanales en Chiguayante, Chile. Solo retiro en tienda.",
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
