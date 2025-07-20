'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  XCircle, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface OrderItem {
  id: string
  productId: string
  variationId?: string | null
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
    stock: number
  }
  variation?: {
    id: string
    name: string
    priceChange: number
  } | null
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  userId?: string | null
  items: OrderItem[]
}

interface OrderActionsProps {
  order: Order
  isOwner: boolean
  isAdmin: boolean
}

export function OrderActions({ order, isOwner, isAdmin }: OrderActionsProps) {
  const router = useRouter()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [modifyReason, setModifyReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [modifiedItems, setModifiedItems] = useState<OrderItem[]>(order.items)

  // Determinar qué acciones están disponibles
  const canCancel = (isOwner || isAdmin) && ['PENDIENTE', 'PREPARANDO'].includes(order.status)
  const canModify = (isOwner || isAdmin) && order.status === 'PENDIENTE'

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('La razón de cancelación es requerida')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: cancelReason,
          adminCancel: isAdmin && !isOwner
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cancelar pedido')
      }

      toast.success('Pedido cancelado exitosamente')
      setCancelDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error(error instanceof Error ? error.message : 'Error al cancelar pedido')
    } finally {
      setLoading(false)
    }
  }

  const handleModify = async () => {
    if (!modifyReason.trim()) {
      toast.error('La razón de modificación es requerida')
      return
    }

    // Validar que hay items
    if (modifiedItems.length === 0) {
      toast.error('El pedido debe tener al menos un producto')
      return
    }

    // Validar cantidades
    if (modifiedItems.some(item => item.quantity <= 0)) {
      toast.error('Las cantidades deben ser mayores a 0')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/modify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: modifiedItems.map(item => ({
            productId: item.productId,
            variationId: item.variationId,
            quantity: item.quantity,
            price: item.price
          })),
          reason: modifyReason
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al modificar pedido')
      }

      toast.success('Pedido modificado exitosamente')
      setModifyDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error modifying order:', error)
      toast.error(error instanceof Error ? error.message : 'Error al modificar pedido')
    } finally {
      setLoading(false)
    }
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setModifiedItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  const removeItem = (itemId: string) => {
    setModifiedItems(items => items.filter(item => item.id !== itemId))
  }

  const calculateNewTotal = () => {
    return modifiedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (!canCancel && !canModify) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-3">
      {canCancel && (
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar Pedido
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Cancelar Pedido #{order.orderNumber}
              </DialogTitle>
              <DialogDescription>
                Esta acción cancelará el pedido y restaurará el stock de los productos. 
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cancelReason">Razón de cancelación *</Label>
                <Textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Explica por qué se cancela este pedido..."
                  className="mt-1"
                />
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Productos afectados:</strong> Se restaurará el stock de todos los productos del pedido.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCancel}
                disabled={loading || !cancelReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {canModify && (
        <Dialog open={modifyDialogOpen} onOpenChange={setModifyDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modificar Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-500" />
                Modificar Pedido #{order.orderNumber}
              </DialogTitle>
              <DialogDescription>
                Puedes cambiar las cantidades o eliminar productos. 
                Los cambios se aplicarán inmediatamente.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Items del pedido */}
              <div>
                <Label className="text-base font-medium">Productos en el pedido</Label>
                <div className="mt-3 space-y-3">
                  {modifiedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-full h-full p-4 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        {item.variation && (
                          <p className="text-sm text-gray-600">{item.variation.name}</p>
                        )}
                        <p className="text-sm font-medium">{formatPrice(item.price)} c/u</p>
                        <Badge variant="outline" className="text-xs">
                          Stock disponible: {item.product.stock + item.quantity}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Cantidad:</Label>
                        <Input
                          type="number"
                          min="0"
                          max={item.product.stock + item.quantity}
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {modifiedItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay productos en el pedido</p>
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Total original:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Nuevo total:</span>
                  <span className={
                    calculateNewTotal() !== order.total 
                      ? calculateNewTotal() > order.total 
                        ? 'text-red-600' 
                        : 'text-green-600'
                      : ''
                  }>
                    {formatPrice(calculateNewTotal())}
                  </span>
                </div>
                {calculateNewTotal() !== order.total && (
                  <div className="text-sm text-gray-600 mt-1">
                    Diferencia: {formatPrice(calculateNewTotal() - order.total)}
                  </div>
                )}
              </div>

              {/* Razón de modificación */}
              <div>
                <Label htmlFor="modifyReason">Razón de modificación *</Label>
                <Textarea
                  id="modifyReason"
                  value={modifyReason}
                  onChange={(e) => setModifyReason(e.target.value)}
                  placeholder="Explica por qué se modifica este pedido..."
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModifyDialogOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleModify}
                disabled={loading || !modifyReason.trim() || modifiedItems.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Modificando...' : 'Confirmar Modificación'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}