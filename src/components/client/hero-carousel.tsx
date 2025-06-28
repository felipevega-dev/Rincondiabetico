'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Cake, Heart, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  ctaText: string
  ctaLink: string
  bgGradient: string
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Dulces Sin Azúcar",
    subtitle: "Para Diabéticos",
    description: "Deliciosos dulces elaborados especialmente para personas con diabetes. Sin azúcar refinada, con todo el sabor.",
    icon: Cake,
    ctaText: "Ver Productos",
    ctaLink: "/productos",
    bgGradient: "from-pink-600 via-pink-700 to-amber-600"
  },
  {
    id: 2,
    title: "Tortas Personalizadas",
    subtitle: "Para Toda Ocasión",
    description: "Celebra tus momentos especiales con nuestras tortas artesanales. Diseños únicos y sabores inolvidables.",
    icon: Heart,
    ctaText: "Hacer Pedido",
    ctaLink: "/contacto",
    bgGradient: "from-amber-600 via-orange-600 to-pink-600"
  },
  {
    id: 3,
    title: "Retiro en Tienda",
    subtitle: "Chiguayante",
    description: "Visítanos en nuestra tienda en Chiguayante. Atención personalizada y productos siempre frescos.",
    icon: Store,
    ctaText: "Ubicación",
    ctaLink: "/contacto",
    bgGradient: "from-pink-700 via-rose-700 to-pink-800"
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-lg border border-border">
      {banners.map((banner, index) => {
        const IconComponent = banner.icon
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-br ${banner.bgGradient} relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 rounded-full bg-white/20"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-12 sm:w-24 h-12 sm:h-24 rounded-full bg-white/15"></div>
                <div className="absolute top-1/2 right-4 sm:right-10 w-8 sm:w-16 h-8 sm:h-16 rounded-full bg-white/10"></div>
              </div>

              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                    {/* Content */}
                    <div className="text-white space-y-4 sm:space-y-6 text-center lg:text-left animate-slide-in-left">
                      <div className="space-y-2">
                        <p className="text-base sm:text-lg lg:text-xl font-medium opacity-90">
                          {banner.subtitle}
                        </p>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                          {banner.title}
                        </h1>
                      </div>
                      
                      <p className="text-sm sm:text-lg lg:text-xl opacity-90 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                        {banner.description}
                      </p>
                      
                      <div className="pt-2 sm:pt-4">
                        <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg group">
                          <Link href={banner.ctaLink}>
                            {banner.ctaText}
                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center lg:justify-end animate-slide-in-right order-first lg:order-last">
                      <div className="relative">
                        <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
                          <IconComponent className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 text-white animate-pulse-slow" />
                        </div>
                        <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border border-white/30 ${
              index === currentSlide 
                ? 'bg-white scale-125 shadow-md' 
                : 'bg-white/50 hover:bg-white/75 hover:scale-110'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 