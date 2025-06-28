'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useState } from 'react'

interface AddToCartButtonProps {
  productName: string
  productId: string
  productPrice: number
  productImage?: string
}

export function AddToCartButton({ 
  productName, 
  productId, 
  productPrice, 
  productImage 
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
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button 
      size="lg" 
      className="w-full flex items-center justify-center gap-2"
      onClick={handleAddToCart}
      disabled={isAdded}
    >
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
    </Button>
  )
} 