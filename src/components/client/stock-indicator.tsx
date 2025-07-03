'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

interface StockIndicatorProps {
  productId: string
  currentStock: number
  className?: string
}

export default function StockIndicator({ 
  productId, 
  currentStock, 
  className = '' 
}: StockIndicatorProps) {
  const [stock, setStock] = useState(currentStock)
  const [isLoading, setIsLoading] = useState(false)

  // Función para obtener stock actualizado
  const refreshStock = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}/stock`)
      if (response.ok) {
        const data = await response.json()
        setStock(data.stock)
      }
    } catch (error) {
      console.error('Error obteniendo stock:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar stock cada 30 segundos si la página está activa
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshStock()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [productId])

  // Determinar color y texto basado en stock
  const getStockInfo = () => {
    if (stock <= 0) {
      return {
        text: 'Sin stock',
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200'
      }
    } else if (stock <= 3) {
      return {
        text: `¡Solo ${stock} disponibles!`,
        variant: 'secondary' as const,
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      }
    } else if (stock <= 10) {
      return {
        text: `${stock} disponibles`,
        variant: 'outline' as const,
        className: 'bg-yellow-50 text-yellow-800 border-yellow-200'
      }
    } else {
      return {
        text: `${stock} disponibles`,
        variant: 'secondary' as const,
        className: 'bg-green-100 text-green-800 border-green-200'
      }
    }
  }

  const stockInfo = getStockInfo()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={stockInfo.variant}
        className={`${stockInfo.className} ${isLoading ? 'animate-pulse' : ''}`}
      >
        {isLoading ? 'Actualizando...' : stockInfo.text}
      </Badge>
      
      {stock > 0 && stock <= 5 && (
        <span className="text-xs text-orange-600 font-medium">
          📦 Stock limitado
        </span>
      )}
    </div>
  )
}

// Componente para mostrar stock en el carrito
export function CartStockValidator({ 
  items 
}: { 
  items: Array<{ productId: string; quantity: number; name: string }> 
}) {
  const [validation, setValidation] = useState<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  } | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const validateStock = async () => {
    if (items.length === 0) return

    setIsValidating(true)
    try {
      const response = await fetch('/api/stock/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items })
      })

      if (response.ok) {
        const data = await response.json()
        setValidation(data)
      }
    } catch (error) {
      console.error('Error validando stock:', error)
    } finally {
      setIsValidating(false)
    }
  }

  useEffect(() => {
    validateStock()
  }, [items])

  if (!validation || items.length === 0) return null

  return (
    <div className="space-y-2">
      {/* Errores de stock */}
      {validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h4 className="font-medium text-red-800 mb-2">
            ⚠️ Problemas de stock:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Advertencias de stock */}
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="font-medium text-yellow-800 mb-2">
            📦 Advertencias:
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Estado de validación */}
      {isValidating && (
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Validando stock...
        </div>
      )}
    </div>
  )
} 