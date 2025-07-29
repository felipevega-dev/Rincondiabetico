'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/providers/cart-provider'

interface StockValidationResult {
  isValid: boolean
  invalidItems: Array<{
    productId: string
    name: string
    requestedQuantity: number
    availableQuantity: number
  }>
  isLoading: boolean
  lastChecked: Date | null
  checkStock: () => Promise<void>
}

export function useStockValidation(): StockValidationResult {
  const { items } = useCart()
  const [isValid, setIsValid] = useState(true)
  const [invalidItems, setInvalidItems] = useState<StockValidationResult['invalidItems']>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStock = async () => {
    if (items.length === 0) {
      setIsValid(true)
      setInvalidItems([])
      return
    }

    setIsLoading(true)
    try {
      // Validar disponibilidad del carrito completo
      const response = await fetch('/api/stock/validate-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      })

      if (response.ok) {
        const data = await response.json()
        setIsValid(data.success)
        
        if (!data.success) {
          // Obtener información detallada de items inválidos
          const invalid = []
          for (const result of data.results) {
            if (!result.available) {
              const cartItem = items.find(item => item.productId === result.productId)
              if (cartItem) {
                // Obtener stock disponible actual
                const stockResponse = await fetch(`/api/stock/available?productId=${result.productId}`)
                const stockData = await stockResponse.json()
                
                invalid.push({
                  productId: result.productId,
                  name: cartItem.name,
                  requestedQuantity: result.requestedQuantity,
                  availableQuantity: stockData.availableStock || 0
                })
              }
            }
          }
          setInvalidItems(invalid)
        } else {
          setInvalidItems([])
        }
      }
      
      setLastChecked(new Date())
    } catch (error) {
      console.error('Error validating stock:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-validar cada 30 segundos si hay items en el carrito
  useEffect(() => {
    if (items.length === 0) {
      setIsValid(true)
      setInvalidItems([])
      return
    }

    // Validar inmediatamente cuando cambian los items
    checkStock()

    // Configurar validación periódica
    const interval = setInterval(checkStock, 30000) // cada 30 segundos
    
    return () => clearInterval(interval)
  }, [items])

  return {
    isValid,
    invalidItems,
    isLoading,
    lastChecked,
    checkStock
  }
}