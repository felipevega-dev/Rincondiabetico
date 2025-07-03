'use client'

import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Settings, Search, Package, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useCart } from '@/components/providers/cart-provider'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const { itemCount } = useCart()
  const [prevItemCount, setPrevItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Top Bar - Anuncios o Información */}
      <div className="bg-gradient-to-r from-primary-100 to-primary-50 px-4 py-3 text-center text-sm font-medium text-primary-900 w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-block animate-bounce">🎂</span>
          <span>¡Pedidos con 48 horas de anticipación! • Retiro en tienda</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group" onClick={closeMobileMenu}>
              <div className="relative">
                <Image 
                  src="/logoweb.png" 
                  alt="Dulces Pasmiño" 
                  width={240} 
                  height={60}
                  className="object-contain h-16 w-auto group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse rounded-2xl transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Productos Dropdown */}
              <div className="relative group">
                <Link 
                  href="/productos" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 rounded-xl transition-all duration-300 font-medium group"
                >
                  Productos
                  <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-300" />
                </Link>
                <div className="absolute top-full left-0 w-48 py-2 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-primary-100/50">
                  <Link href="/productos?categoria=tortas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    Tortas
                  </Link>
                  <Link href="/productos?categoria=cupcakes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    Cupcakes
                  </Link>
                  <Link href="/productos?categoria=galletas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    Galletas
                  </Link>
                </div>
              </div>

              <Link 
                href="/sobre-nosotros" 
                className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/contacto" 
                className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
              >
                Contacto
              </Link>
            </div>

            {/* Search Bar & Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 rounded-xl border border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button 
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 p-1 hover:bg-primary-50"
                  >
                    <Search className="h-4 w-4 text-gray-500" />
                  </Button>
                </form>
              </div>

              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-primary-50"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link href="/carrito" className="relative group">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${
                      isAnimating ? 'animate-bounce scale-125' : ''
                    }`}>
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
                      {isAdmin && (
                        <Link href="/admin">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl"
                          >
                            <Settings className="h-5 w-5" />
                          </Button>
                        </Link>
                      )}
                      
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-300",
                            userButtonPopoverCard: "shadow-xl border-primary-100 rounded-xl",
                            userButtonPopoverActionButton: "hover:bg-primary-50 rounded-lg",
                            userButtonPopoverFooter: "hidden"
                          }
                        }}
                        userProfileMode="navigation"
                        userProfileUrl="/pedidos"
                      />
                    </div>
                  ) : (
                    <Link href="/sign-in">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl px-6"
                      >
                        Ingresar
                      </Button>
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-primary-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden pt-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button 
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-6 p-1 hover:bg-primary-50"
                >
                  <Search className="h-4 w-4 text-gray-500" />
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-primary-100/50 bg-white">
            <div className="px-4 py-2 space-y-1">
              <Link
                href="/productos"
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                Productos
              </Link>
              <Link
                href="/sobre-nosotros"
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contacto"
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 