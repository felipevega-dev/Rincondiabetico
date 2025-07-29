'use client'

import { useState } from 'react'
import { useWishlist } from '@/hooks/use-wishlist'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'icon'
  showText?: boolean
}

export function WishlistButton({ 
  productId, 
  className,
  size = 'md',
  variant = 'outline',
  showText = false
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const inWishlist = isInWishlist(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsProcessing(true)
    try {
      await toggleWishlist(productId)
    } finally {
      setIsProcessing(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8'
      case 'lg':
        return 'h-12 w-12'
      default:
        return 'h-10 w-10'
    }
  }

  const getHeartSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'lg':
        return 'h-6 w-6'
      default:
        return 'h-5 w-5'
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isProcessing}
        className={cn(
          getSizeClasses(),
          'rounded-full transition-all duration-200',
          inWishlist 
            ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50',
          isProcessing && 'animate-pulse',
          className
        )}
      >
        <Heart 
          className={cn(
            getHeartSize(),
            'transition-all duration-200',
            inWishlist ? 'fill-current' : 'fill-none'
          )} 
        />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        'transition-all duration-200',
        inWishlist 
          ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300' 
          : 'text-gray-600 hover:text-red-500 hover:border-red-200',
        isProcessing && 'animate-pulse',
        showText && 'gap-2',
        className
      )}
    >
      <Heart 
        className={cn(
          getHeartSize(),
          'transition-all duration-200',
          inWishlist ? 'fill-current' : 'fill-none'
        )} 
      />
      {showText && (
        <span className="hidden sm:inline">
          {inWishlist ? 'En favoritos' : 'Agregar a favoritos'}
        </span>
      )}
    </Button>
  )
}

// Componente compacto para usar en cards de productos
export function WishlistHeartIcon({ productId, className }: { productId: string, className?: string }) {
  return (
    <WishlistButton
      productId={productId}
      variant="icon"
      size="sm"
      className={cn('absolute top-2 right-2 z-10', className)}
    />
  )
}