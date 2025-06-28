'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
  bgColor: string
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Postres Sin Azúcar",
    subtitle: "Para Diabéticos",
    description: "Deliciosos postres elaborados especialmente para personas con diabetes. Sin azúcar refinada, con todo el sabor.",
    image: "🍰",
    ctaText: "Ver Productos",
    ctaLink: "/productos",
    bgColor: "from-pink-400 to-purple-600"
  },
  {
    id: 2,
    title: "Tortas Personalizadas",
    subtitle: "Para Toda Ocasión",
    description: "Celebra tus momentos especiales con nuestras tortas artesanales. Diseños únicos y sabores inolvidables.",
    image: "🎂",
    ctaText: "Hacer Pedido",
    ctaLink: "/contacto",
    bgColor: "from-orange-400 to-red-600"
  },
  {
    id: 3,
    title: "Retiro en Tienda",
    subtitle: "Chiguayante",
    description: "Visítanos en nuestra tienda en Chiguayante. Atención personalizada y productos siempre frescos.",
    image: "🏪",
    ctaText: "Ubicación",
    ctaLink: "/contacto",
    bgColor: "from-blue-400 to-indigo-600"
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

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
    <div 
      className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${banner.bgColor} flex items-center justify-center relative`}>
            {/* Content */}
            <div className="text-center text-white z-10 max-w-4xl px-6">
              <div className="text-8xl md:text-9xl mb-6 animate-bounce-soft">
                {banner.image}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {banner.title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white/90">
                {banner.subtitle}
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/80 leading-relaxed">
                {banner.description}
              </p>
              <Link
                href={banner.ctaLink}
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {banner.ctaText}
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-10 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 