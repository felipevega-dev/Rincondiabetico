'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { useState } from 'react'

interface AddToCartButtonProps {
  productName: string
  productId: string
  productPrice: number
  productImage?: string
  className?: string
}

export function AddToCartButton({ 
  productName, 
  productId, 
  productPrice, 
  productImage,
  className 
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage
    })
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
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
          </>
        )}
      </div>
    </Button>
  )
} 