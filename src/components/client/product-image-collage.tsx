'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { ImageGalleryModal } from './image-gallery-modal'

interface ProductImageCollageProps {
  images: string[]
  productName: string
  className?: string
}

export function ProductImageCollage({ 
  images, 
  productName, 
  className = "" 
}: ProductImageCollageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Limitar a máximo 3 imágenes
  const displayImages = images.slice(0, 3)

  const openModal = (index: number) => {
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  if (!displayImages.length) {
    return (
      <div className={`aspect-square bg-gray-200 flex items-center justify-center rounded-lg ${className}`}>
        <Package className="h-16 w-16 text-gray-400" />
      </div>
    )
  }

  if (displayImages.length === 1) {
    return (
      <>
        <div className={`aspect-square relative rounded-lg overflow-hidden cursor-pointer group ${className}`}>
          <Image
            src={displayImages[0]}
            alt={productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => openModal(0)}
            priority
          />
        </div>
        <ImageGalleryModal
          images={images}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialIndex={selectedImageIndex}
          productName={productName}
        />
      </>
    )
  }

  if (displayImages.length === 2) {
    return (
      <>
        <div className={`aspect-square grid grid-cols-1 grid-rows-2 gap-2 ${className}`}>
          {/* Primera imagen - ocupa la mitad superior */}
          <div className="relative rounded-lg overflow-hidden cursor-pointer group">
            <Image
              src={displayImages[0]}
              alt={`${productName} - imagen principal`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onClick={() => openModal(0)}
              priority
            />
          </div>
          
          {/* Segunda imagen - ocupa la mitad inferior */}
          <div className="relative rounded-lg overflow-hidden cursor-pointer group">
            <Image
              src={displayImages[1]}
              alt={`${productName} - imagen 2`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onClick={() => openModal(1)}
            />
          </div>
        </div>
        <ImageGalleryModal
          images={images}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialIndex={selectedImageIndex}
          productName={productName}
        />
      </>
    )
  }

  // 3 imágenes - layout collage
  return (
    <>
      <div className={`aspect-square grid grid-cols-2 grid-rows-2 gap-2 ${className}`}>
        {/* Primera imagen - ocupa la mitad izquierda completa */}
        <div className="row-span-2 relative rounded-lg overflow-hidden cursor-pointer group">
          <Image
            src={displayImages[0]}
            alt={`${productName} - imagen principal`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => openModal(0)}
            priority
          />
        </div>
        
        {/* Segunda imagen - cuadrante superior derecho */}
        <div className="relative rounded-lg overflow-hidden cursor-pointer group">
          <Image
            src={displayImages[1]}
            alt={`${productName} - imagen 2`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => openModal(1)}
          />
        </div>
        
        {/* Tercera imagen - cuadrante inferior derecho */}
        <div className="relative rounded-lg overflow-hidden cursor-pointer group">
          <Image
            src={displayImages[2]}
            alt={`${productName} - imagen 3`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => openModal(2)}
          />
          
          {/* Indicador si hay más imágenes */}
          {images.length > 3 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                +{images.length - 3} más
              </span>
            </div>
          )}
        </div>
      </div>
      
      <ImageGalleryModal
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={selectedImageIndex}
        productName={productName}
      />
    </>
  )
} 