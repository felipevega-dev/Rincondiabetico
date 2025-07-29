'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Trash2,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'mercadopago' | 'bank_transfer'
  name: string
  details: string
  last4?: string
  isDefault: boolean
  isActive: boolean
  expiryDate?: string
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulando métodos de pago (en producción estos vendrían de la API)
  useEffect(() => {
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'mercadopago',
        name: 'MercadoPago',
        details: 'Paga con tarjeta, efectivo o transferencia',
        isDefault: true,
        isActive: true
      },
      {
        id: '2',
        type: 'bank_transfer',
        name: 'Transferencia Bancaria',
        details: 'Banco Estado - Cuenta Corriente',
        isDefault: false,
        isActive: true
      }
    ]
    
    setTimeout(() => {
      setPaymentMethods(mockPaymentMethods)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSetDefault = async (methodId: string) => {
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
      setPaymentMethods(updatedMethods)
      toast.success('Método de pago predeterminado actualizado')
    } catch {
      toast.error('Error al actualizar método de pago')
    }
  }

  const handleDelete = async (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId)
    if (method?.isDefault) {
      toast.error('No puedes eliminar el método de pago predeterminado')
      return
    }

    if (confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      try {
        setPaymentMethods(paymentMethods.filter(method => method.id !== methodId))
        toast.success('Método de pago eliminado exitosamente')
      } catch {
        toast.error('Error al eliminar método de pago')
      }
    }
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return CreditCard
      case 'mercadopago':
        return Smartphone
      case 'bank_transfer':
        return Building
      default:
        return CreditCard
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'credit_card':
        return 'Tarjeta de Crédito'
      case 'debit_card':
        return 'Tarjeta de Débito'
      case 'mercadopago':
        return 'MercadoPago'
      case 'bank_transfer':
        return 'Transferencia Bancaria'
      default:
        return type
    }
  }

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'credit_card':
        return 'bg-blue-100 text-blue-800'
      case 'debit_card':
        return 'bg-green-100 text-green-800'
      case 'mercadopago':
        return 'bg-purple-100 text-purple-800'
      case 'bank_transfer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Métodos de Pago</h1>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Métodos de Pago</h1>
        <Button className="flex items-center gap-2" disabled>
          <Plus className="h-4 w-4" />
          Agregar Método
        </Button>
      </div>

      {/* Información sobre métodos de pago */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Métodos de Pago Disponibles</h3>
              <p className="text-sm text-blue-700 mt-1">
                Aceptamos MercadoPago (tarjetas de crédito, débito, efectivo) y transferencias bancarias. 
                Los pagos son procesados de forma segura.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de métodos de pago */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes métodos de pago configurados
              </h3>
              <p className="text-gray-600 mb-6">
                Los métodos de pago se configuran automáticamente durante el checkout
              </p>
            </CardContent>
          </Card>
        ) : (
          paymentMethods.map((method) => {
            const IconComponent = getPaymentIcon(method.type)
            return (
              <Card key={method.id} className={method.isDefault ? 'ring-2 ring-pink-500' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getPaymentColor(method.type)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{method.name}</h3>
                          {method.isDefault && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          <Badge variant="outline" className={getPaymentColor(method.type)}>
                            {getPaymentTypeLabel(method.type)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600">{method.details}</p>
                        {method.last4 && (
                          <p className="text-sm text-gray-500">
                            Terminada en ****{method.last4}
                            {method.expiryDate && ` • Vence ${method.expiryDate}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {method.isActive ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className={`text-sm ${method.isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                          {method.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Predeterminado
                          </Button>
                        )}
                        
                        {method.type !== 'mercadopago' && method.type !== 'bank_transfer' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(method.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={method.isDefault}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de Seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Pagos Seguros</h4>
              <p className="text-sm text-gray-600">
                Todos los pagos son procesados a través de MercadoPago con encriptación SSL de 256 bits.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Datos Protegidos</h4>
              <p className="text-sm text-gray-600">
                No almacenamos información de tarjetas de crédito en nuestros servidores.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Múltiples Opciones</h4>
              <p className="text-sm text-gray-600">
                Acepta tarjetas de crédito, débito, efectivo y transferencias bancarias a través de MercadoPago.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}