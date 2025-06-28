'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart, Check, XCircle, AlertTriangle } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { useState } from 'react'

interface AddToCartButtonProps {
  productName: string
  productId: string
  productPrice: number
  productImage?: string
  productStock?: number
  className?: string
}

export function AddToCartButton({ 
  productName, 
  productId, 
  productPrice, 
  productImage,
  productStock = 0,
  className 
}: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  
  const currentQuantity = getItemQuantity(productId)
  const canAddMore = currentQuantity < productStock
  const isOutOfStock = productStock <= 0

  const handleAddToCart = () => {
    if (!canAddMore || isOutOfStock) return
    
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage
    })
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  if (isOutOfStock) {
    return (
      <Button 
        size="lg" 
        className={`${className || 'w-full'} flex items-center justify-center gap-2 bg-gray-400 cursor-not-allowed`}
        disabled
      >
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          Sin Stock
        </div>
      </Button>
    )
  }

  if (!canAddMore) {
    return (
      <Button 
        size="lg" 
        className={`${className || 'w-full'} flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600`}
        disabled
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Límite Alcanzado ({currentQuantity}/{productStock})
        </div>
      </Button>
    )
  }

  return (
    <Button 
      size="lg" 
      className={`${className || 'w-full'} flex items-center justify-center gap-2 transition-all duration-200 ${
        isAdded ? 'bg-green-600 hover:bg-green-700' : ''
      }`}
      onClick={handleAddToCart}
      disabled={isAdded}
    >
      <div className={`flex items-center gap-2 ${isAdded ? 'animate-bounce-soft' : ''}`}>
        {isAdded ? (
          <>
            <Check className="h-5 w-5" />
            ¡Agregado!
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Agregar al Carrito
            {productStock > 0 && (
              <span className="text-xs opacity-75">
                ({currentQuantity}/{productStock})
              </span>
            )}
          </>
        )}
      </div>
    </Button>
  )
} 