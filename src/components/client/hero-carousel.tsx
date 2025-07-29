'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Banner } from '@/types'

type HeroCarouselProps = {
  banners: Banner[]
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Si no hay banners, mostrar mensaje
  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-lg border border-border bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">¡Bienvenido a Postres Pasmiño!</h2>
          <p className="text-lg opacity-90">Dulces especiales para diabéticos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-lg border border-border">
      {banners.map((banner, index) => (
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
          {/* Background Image */}
          <div className="relative w-full h-full">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white space-y-4 sm:space-y-6">
                  {banner.subtitle && (
                    <p className="text-base sm:text-lg lg:text-xl font-medium opacity-90">
                      {banner.subtitle}
                    </p>
                  )}
                  
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    {banner.title}
                  </h1>
                  
                  {banner.description && (
                    <p className="text-sm sm:text-lg lg:text-xl opacity-90 leading-relaxed">
                      {banner.description}
                    </p>
                  )}
                  
                                     {banner.buttonText && banner.buttonLink && (
                     <div className="pt-2 sm:pt-4">
                       <Button asChild size="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg group border-0">
                         <Link href={banner.buttonLink}>
                           {banner.buttonText}
                           <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                         </Link>
                       </Button>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Solo mostrar si hay más de 1 banner */}
      {banners.length > 1 && (
        <>
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
        </>
      )}
    </div>
  )
} 