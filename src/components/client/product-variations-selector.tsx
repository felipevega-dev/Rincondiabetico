'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check, XCircle, AlertTriangle, Users, Cookie } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { VariationType, ProductVariation } from '@/types'

interface ProductVariationsSelectorProps {
  productId: string
  productName: string
  basePrice: number
  productImage?: string
  productStock: number
  variations: ProductVariation[]
  className?: string
}

export function ProductVariationsSelector({
  productId,
  productName,
  basePrice,
  productImage,
  productStock,
  variations,
  className
}: ProductVariationsSelectorProps) {
  const { addItem, getItemQuantity } = useCart()
  const [selectedVariations, setSelectedVariations] = useState<ProductVariation[]>([])
  const [isAdded, setIsAdded] = useState(false)
  
  const sizeVariations = variations.filter(v => v.type === VariationType.SIZE && v.isAvailable)
  const ingredientVariations = variations.filter(v => v.type === VariationType.INGREDIENT && v.isAvailable)
  
  // Auto-select first size if available
  useEffect(() => {
    if (sizeVariations.length > 0 && !selectedVariations.some(v => v.type === VariationType.SIZE)) {
      setSelectedVariations(prev => [...prev, sizeVariations[0]])
    }
  }, [sizeVariations])

  const currentQuantity = getItemQuantity(productId)
  const canAddMore = currentQuantity < productStock
  const isOutOfStock = productStock <= 0

  const selectedSize = selectedVariations.find(v => v.type === VariationType.SIZE)
  const selectedIngredients = selectedVariations.filter(v => v.type === VariationType.INGREDIENT)

  const totalPriceChange = selectedVariations.reduce((sum, variation) => sum + variation.priceChange, 0)
  const finalPrice = basePrice + totalPriceChange

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleVariationSelect = (variation: ProductVariation, type: VariationType) => {
    setSelectedVariations(prev => {
      if (type === VariationType.SIZE) {
        // Only one size can be selected
        return [...prev.filter(v => v.type !== VariationType.SIZE), variation]
      } else {
        // Multiple ingredients can be selected/deselected
        const isSelected = prev.some(v => v.id === variation.id)
        if (isSelected) {
          return prev.filter(v => v.id !== variation.id)
        } else {
          return [...prev, variation]
        }
      }
    })
  }

  const handleAddToCart = () => {
    if (!canAddMore || isOutOfStock) return
    
    // Create unique cart item with variations
    const cartItemId = `${productId}-${selectedVariations.map(v => v.id).sort().join('-')}`
    
    addItem({
      id: cartItemId,
      productId: productId,
      name: productName,
      price: finalPrice,
      image: productImage,
      variations: selectedVariations.map(v => ({
        id: v.id!,
        name: v.name,
        priceChange: v.priceChange,
        type: v.type
      }))
    })
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  if (isOutOfStock) {
    return (
      <div className={className}>
        <Button 
          size="lg" 
          className="w-full flex items-center justify-center gap-2 bg-gray-400 cursor-not-allowed"
          disabled
        >
          <XCircle className="h-5 w-5" />
          Sin Stock
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Size Selection */}
      {sizeVariations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tamaño
          </h3>
          <p className="text-sm text-gray-600 mb-3">Selecciona el tamaño ideal para tu ocasión</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sizeVariations.map((variation) => {
              const isSelected = selectedSize?.id === variation.id
              return (
                <button
                  key={variation.id}
                  onClick={() => handleVariationSelect(variation, VariationType.SIZE)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    isSelected 
                      ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">{variation.name}</div>
                  {variation.priceChange !== 0 && (
                    <div className={`text-sm font-medium ${
                      variation.priceChange > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {variation.priceChange > 0 ? '+' : ''}{formatPrice(variation.priceChange)}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Ingredient Variations */}
      {ingredientVariations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Personalización
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {ingredientVariations.map((variation) => {
              const isSelected = selectedIngredients.some(v => v.id === variation.id)
              return (
                <button
                  key={variation.id}
                  onClick={() => handleVariationSelect(variation, VariationType.INGREDIENT)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    isSelected 
                      ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{variation.name}</div>
                      {variation.description && (
                        <div className="text-sm text-gray-600 mt-1">{variation.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {variation.priceChange !== 0 && (
                        <div className={`text-sm font-medium ${
                          variation.priceChange > 0 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {variation.priceChange > 0 ? '+' : ''}{formatPrice(variation.priceChange)}
                        </div>
                      )}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Precio base:</span>
            <span>{formatPrice(basePrice)}</span>
          </div>
          {selectedVariations
            .filter(variation => variation.priceChange !== 0)
            .map((variation) => (
            <div key={variation.id} className="flex justify-between text-sm">
              <span>{variation.name}:</span>
              <span className={variation.priceChange >= 0 ? 'text-orange-600' : 'text-green-600'}>
                {variation.priceChange > 0 ? '+' : ''}{formatPrice(variation.priceChange)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-pink-600">{formatPrice(finalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      {!canAddMore ? (
        <Button 
          size="lg" 
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 py-4 text-lg font-semibold text-white"
          disabled
        >
          <AlertTriangle className="h-6 w-6" />
          Límite Alcanzado ({currentQuantity}/{productStock})
        </Button>
      ) : (
        <Button 
          size="lg" 
          className={`w-full flex items-center justify-center gap-2 transition-all duration-200 py-4 text-lg font-semibold shadow-lg text-white ${
            isAdded 
              ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
              : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-200'
          }`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          <div className={`flex items-center gap-2 ${isAdded ? 'animate-bounce-soft' : ''}`}>
            {isAdded ? (
              <>
                <Check className="h-6 w-6" />
                ¡Agregado al Carrito!
              </>
            ) : (
              <>
                <ShoppingCart className="h-6 w-6" />
                Agregar al Carrito - {formatPrice(finalPrice)}
                {productStock > 0 && (
                  <span className="text-sm opacity-90 ml-2">
                    ({currentQuantity}/{productStock})
                  </span>
                )}
              </>
            )}
          </div>
        </Button>
      )}

      <p className="text-sm text-gray-600 text-center">
        * Solo retiro en tienda física
      </p>
    </div>
  )
}
