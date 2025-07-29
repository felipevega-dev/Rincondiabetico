'use client'

import { useState, useEffect } from 'react'
import { StockMovement, StockMovementType, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface StockMovementWithUser extends StockMovement {
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

interface StockHistoryProps {
  productId: string
  productName: string
}

const movementTypeLabels: Record<StockMovementType, string> = {
  MANUAL_INCREASE: 'Incremento Manual',
  MANUAL_DECREASE: 'Decremento Manual',
  PURCHASE: 'Compra',
  CANCEL: 'Cancelación',
  ADJUSTMENT: 'Ajuste',
  RESERVATION: 'Reserva',
  RELEASE: 'Liberación',
  RETURN: 'Devolución'
}

const movementTypeColors: Record<StockMovementType, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  MANUAL_INCREASE: 'default',
  MANUAL_DECREASE: 'destructive',
  PURCHASE: 'destructive',
  CANCEL: 'default',
  ADJUSTMENT: 'secondary',
  RESERVATION: 'outline',
  RELEASE: 'outline',
  RETURN: 'default'
}

export function StockHistory({ productId, productName }: StockHistoryProps) {
  const [movements, setMovements] = useState<StockMovementWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [adjusting, setAdjusting] = useState(false)
  const [newStock, setNewStock] = useState('')
  const [reason, setReason] = useState('')

  const fetchMovements = async () => {
    try {
      const response = await fetch(`/api/admin/stock/movements/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setMovements(data.movements)
      }
    } catch (error) {
      console.error('Error fetching movements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustStock = async () => {
    if (!newStock || !reason) return

    try {
      setAdjusting(true)
      const response = await fetch('/api/admin/stock/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          newStock: parseInt(newStock),
          reason
        })
      })

      if (response.ok) {
        setNewStock('')
        setReason('')
        fetchMovements() // Refrescar historial
      }
    } catch (error) {
      console.error('Error adjusting stock:', error)
    } finally {
      setAdjusting(false)
    }
  }

  useEffect(() => {
    fetchMovements()
  }, [productId])

  if (loading) {
    return <div>Cargando historial...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Stock - {productName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulario de ajuste */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Ajustar Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                type="number"
                placeholder="Nuevo stock"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
              />
              <Input
                placeholder="Motivo del ajuste"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                onClick={handleAdjustStock}
                disabled={adjusting || !newStock || !reason}
              >
                {adjusting ? 'Ajustando...' : 'Ajustar Stock'}
              </Button>
            </div>
          </div>

          {/* Lista de movimientos */}
          <div className="space-y-3">
            {movements.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay movimientos de stock registrados
              </p>
            ) : (
              movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={movementTypeColors[movement.type]}>
                        {movementTypeLabels[movement.type]}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {formatDate(movement.createdAt)}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity} unidades
                      </span>
                      <span className="text-gray-600 ml-2">
                        ({movement.previousStock} → {movement.newStock})
                      </span>
                    </div>

                    {movement.reason && (
                      <p className="text-sm text-gray-600">
                        {movement.reason}
                      </p>
                    )}

                    {movement.user && (
                      <p className="text-xs text-gray-500">
                        Por: {movement.user.firstName} {movement.user.lastName}
                      </p>
                    )}

                    {movement.reference && (
                      <p className="text-xs text-gray-500">
                        Ref: {movement.reference}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {movement.newStock}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock final
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}