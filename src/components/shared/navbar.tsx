'use client'

import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Settings, User, Cake, Menu, X, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useCart } from '@/components/providers/cart-provider'

export function Navbar() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const { itemCount } = useCart()
  const [prevItemCount, setPrevItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      setIsAdmin(true)
    }
  }, [user])

  useEffect(() => {
    if (itemCount > prevItemCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
    setPrevItemCount(itemCount)
  }, [itemCount, prevItemCount])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-primary-100/50 shadow-lg shadow-primary-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group" onClick={closeMobileMenu}>
            <div className="relative">
              <Image 
                src="/logoweb.png" 
                alt="Postres Pasmiño" 
                width={200} 
                height={48}
                className="object-contain h-12 w-auto group-hover:scale-105 transition-transform duration-300 rounded-lg shadow-sm"
              />
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse rounded-lg transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/productos" 
              className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 relative group font-medium"
              onClick={closeMobileMenu}
            >
              Productos
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
            <Link 
              href="/sobre-nosotros" 
              className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 relative group font-medium"
              onClick={closeMobileMenu}
            >
              Sobre Nosotros
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
            <Link 
              href="/contacto" 
              className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 relative group font-medium"
              onClick={closeMobileMenu}
            >
              Contacto
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon */}
            <Link href="/carrito" className="relative group" onClick={closeMobileMenu}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg ${
                    isAnimating ? 'animate-bounce scale-125' : ''
                  } transition-all duration-300`}>
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Section */}
            {isLoaded && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    {/* Orders Link for logged users */}
                    <Link href="/pedidos" onClick={closeMobileMenu}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
                      >
                        <Package className="h-5 w-5" />
                      </Button>
                    </Link>

                    {/* Admin Panel Link */}
                    {isAdmin && (
                      <Link href="/admin" onClick={closeMobileMenu}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                        </Link>
                    )}
                    
                    {/* User Button */}
                    <div className="scale-90">
                    <UserButton 
                        afterSignOutUrl="/"
                      appearance={{
                        elements: {
                            avatarBox: "w-8 h-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300",
                            userButtonPopoverCard: "shadow-xl border-primary-100",
                            userButtonPopoverActionButton: "hover:bg-primary-50"
                          }
                      }}
                    />
                    </div>
                  </div>
                ) : (
                  <Link href="/sign-in" onClick={closeMobileMenu}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                      </Link>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
            )}
            </Button>
        </div>
      </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-primary-100/50 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/productos"
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                🍰 Productos
            </Link>
              <Link
                href="/sobre-nosotros"
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                ℹ️ Sobre Nosotros
            </Link>
              <Link
                href="/contacto"
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                📞 Contacto
            </Link>
              
              {user && (
                <Link
                  href="/pedidos"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                  onClick={closeMobileMenu}
                >
                  📦 Mis Pedidos
                    </Link>
              )}

                  {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                  onClick={closeMobileMenu}
                >
                  ⚙️ Panel Admin
                      </Link>
                  )}

              {!user && (
                <Link
                  href="/sign-in"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                  onClick={closeMobileMenu}
                >
                  👤 Iniciar Sesión
                    </Link>
              )}
            </div>
            </div>
          )}
      </div>
    </nav>
  )
} 