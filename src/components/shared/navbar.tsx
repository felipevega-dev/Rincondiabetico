'use client'

import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ShoppingCart, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useCart } from '@/components/providers/cart-provider'

export function Navbar() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const { itemCount } = useCart()
  const [prevItemCount, setPrevItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      setIsAdmin(true)
    }
  }, [user])

  // Animar contador cuando cambie
  useEffect(() => {
    if (itemCount !== prevItemCount && itemCount > 0) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
    setPrevItemCount(itemCount)
  }, [itemCount, prevItemCount])

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧁</span>
            <span className="font-bold text-xl text-gray-900">Rincón Diabético</span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/productos" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Productos
            </Link>
            <Link 
              href="/sobre-nosotros" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Sobre Nosotros
            </Link>
            <Link 
              href="/contacto" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Contacto
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/carrito">
              <Button variant="ghost" size="sm" className="relative p-2">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ${
                    isAnimating ? 'animate-bounce-soft scale-110' : ''
                  }`}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Authentication */}
            {isLoaded && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {/* Admin Panel Access */}
                    {isAdmin && (
                      <Link href="/admin">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2 border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300"
                        >
                          <Settings className="h-4 w-4" />
                          <span className="hidden sm:inline">Admin</span>
                        </Button>
                      </Link>
                    )}

                    {/* Dashboard Access */}
                    <Link href="/dashboard">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Mi Cuenta</span>
                      </Button>
                    </Link>

                    {/* User Button */}
                    <div className="ml-2">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "h-8 w-8"
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/sign-in">
                      <Button variant="ghost" size="sm" className="text-gray-700 hover:text-pink-600">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu placeholder */}
      <div className="md:hidden border-t">
        <div className="px-4 py-2 space-y-1">
          <Link 
            href="/productos" 
            className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
          >
            Productos
          </Link>
          <Link 
            href="/sobre-nosotros" 
            className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
          >
            Sobre Nosotros
          </Link>
          <Link 
            href="/contacto" 
            className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md"
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  )
} 