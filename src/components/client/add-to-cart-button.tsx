'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

interface AddToCartButtonProps {
  productName: string
  productId: string
}

export function AddToCartButton({ productName, productId }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    // TODO: Implementar lógica del carrito
    console.log('Agregando al carrito:', productName, productId)
    alert(`${productName} agregado al carrito!`)
  }

  return (
    <Button 
      size="lg" 
      className="w-full flex items-center justify-center gap-2"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-5 w-5" />
      Agregar al Carrito
    </Button>
  )
} 