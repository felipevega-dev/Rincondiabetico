'use client'

import { useStockValidation } from '@/hooks/use-stock-validation'
import { useCart } from '@/components/providers/cart-provider'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'
import { toast } from 'sonner'

export function StockValidationAlert() {
  const { isValid, invalidItems, isLoading, lastChecked, checkStock } = useStockValidation()
  const { updateQuantity, removeItem } = useCart()

  if (isValid || invalidItems.length === 0) {
    return null
  }

  const handleFixQuantity = (productId: string, availableQuantity: number) => {
    const item = invalidItems.find(item => item.productId === productId)
    if (!item) return
    
    // Buscar el itemId en el carrito para actualizar
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`)
    const itemId = cartItem?.getAttribute('data-item-id')
    
    if (itemId) {
      if (availableQuantity > 0) {
        updateQuantity(itemId, availableQuantity)
        toast.success(`Cantidad ajustada a ${availableQuantity} unidades disponibles`)
      } else {
        removeItem(itemId)
        toast.info('Producto removido: Sin stock disponible')
      }
    }
  }

  const handleRemoveItem = (productId: string) => {
    const item = invalidItems.find(item => item.productId === productId)
    if (!item) return
    
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`)
    const itemId = cartItem?.getAttribute('data-item-id')
    
    if (itemId) {
      removeItem(itemId)
      toast.info(`${item.name} removido del carrito`)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Algunos productos en tu carrito no tienen suficiente stock
          </h3>
          
          <div className="space-y-3">
            {invalidItems.map((item) => (
              <div key={item.productId} className="bg-white rounded-md p-3 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Solicitaste <span className="font-medium">{item.requestedQuantity}</span> unidades, 
                  pero solo hay <span className="font-medium text-yellow-600">{item.availableQuantity}</span> disponibles.
                </p>
                
                <div className="flex gap-2">
                  {item.availableQuantity > 0 ? (
                    <Button
                      size="sm"
                      onClick={() => handleFixQuantity(item.productId, item.availableQuantity)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Ajustar a {item.availableQuantity} unidades
                    </Button>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">Sin stock disponible</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-yellow-200">
            <div className="text-xs text-yellow-700">
              {lastChecked && (
                <>Última verificación: {lastChecked.toLocaleTimeString('es-CL')}</>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={checkStock}
              disabled={isLoading}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isLoading ? 'Verificando...' : 'Verificar stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}