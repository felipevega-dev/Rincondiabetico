'use client'

import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ShoppingCart, Settings, User, Cake, Menu, X } from 'lucide-react'
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

  // Animar contador cuando cambie
  useEffect(() => {
    if (itemCount !== prevItemCount && itemCount > 0) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
    setPrevItemCount(itemCount)
  }, [itemCount, prevItemCount])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <div className="p-2 bg-primary rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Cake className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              Dulces Pasmiño
            </span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/productos" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link 
              href="/sobre-nosotros" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Sobre Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link 
              href="/contacto" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/carrito" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="relative p-3 hover:bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 shadow-md ${
                    isAnimating ? 'animate-bounce-soft scale-110' : ''
                  }`}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            {/* User Authentication - Desktop */}
            {isLoaded && (
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <>
                    {/* Admin Panel Link */}
                    {isAdmin && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href="/admin">
                          <Settings className="h-5 w-5 text-accent" />
                        </Link>
                      </Button>
                    )}
                    
                    {/* User Orders */}
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/pedidos">
                        <User className="h-5 w-5" />
                      </Link>
                    </Button>
                    
                    {/* User Button */}
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: 'w-8 h-8',
                        },
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/sign-in">
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/sign-up">
                        Registrarse
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden border-t border-border bg-background transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-4 space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start" onClick={closeMobileMenu}>
            <Link href="/productos">
              Productos
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start" onClick={closeMobileMenu}>
            <Link href="/sobre-nosotros">
              Sobre Nosotros
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start" onClick={closeMobileMenu}>
            <Link href="/contacto">
              Contacto
            </Link>
          </Button>
          
          {/* Mobile User Authentication */}
          {isLoaded && (
            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <>
                  <Button asChild variant="ghost" className="w-full justify-start" onClick={closeMobileMenu}>
                    <Link href="/pedidos">
                      <User className="h-5 w-5 mr-2" />
                      Mis Pedidos
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="ghost" className="w-full justify-start" onClick={closeMobileMenu}>
                      <Link href="/admin">
                        <Settings className="h-5 w-5 mr-2 text-accent" />
                        Panel Admin
                      </Link>
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="ghost" className="w-full justify-start" onClick={closeMobileMenu}>
                    <Link href="/sign-in">
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button asChild className="w-full" onClick={closeMobileMenu}>
                    <Link href="/sign-up">
                      Registrarse
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 