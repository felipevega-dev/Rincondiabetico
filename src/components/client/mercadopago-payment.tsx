'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/providers/toast-provider'
import { useCart } from '@/components/providers/cart-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreditCard, Lock, AlertCircle } from 'lucide-react'

// Declarar MercadoPago global
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface PaymentMethod {
  id: string
  name: string
  payment_type_id: string
  thumbnail: string
}

interface MercadoPagoPaymentProps {
  orderId: string
  amount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

export function MercadoPagoPayment({ orderId, amount, onSuccess, onError }: MercadoPagoPaymentProps) {
  const { showToast } = useToast()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [mp, setMp] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    securityCode: '',
    cardholderName: '',
    installments: 1
  })

  useEffect(() => {
    loadMercadoPagoSDK()
    fetchPaymentMethods()
  }, [])

  const loadMercadoPagoSDK = () => {
    // Verificar si ya está cargado
    if (window.MercadoPago && typeof window.MercadoPago === 'function') {
      initializeMercadoPago()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = () => {
      console.log('MercadoPago SDK loaded')
      initializeMercadoPago()
    }
    script.onerror = () => {
      console.error('Error loading MercadoPago SDK')
      showToast('Error al cargar MercadoPago. Recarga la página.', 'error')
    }
    document.head.appendChild(script)
  }

  const initializeMercadoPago = () => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    
    if (!publicKey) {
      console.error('MercadoPago public key not found')
      showToast('Configuración de MercadoPago no encontrada', 'error')
      return
    }

    if (!window.MercadoPago) {
      console.error('MercadoPago SDK not loaded')
      return
    }

    try {
      let mpInstance
      
      // Intentar diferentes métodos de inicialización
      if (typeof window.MercadoPago === 'function') {
        // SDK v2
        mpInstance = new window.MercadoPago(publicKey, {
          locale: 'es-CL'
        })
      } else if (window.MercadoPago.setPublishableKey) {
        // SDK v1
        window.MercadoPago.setPublishableKey(publicKey)
        mpInstance = window.MercadoPago
      } else {
        // Fallback
        mpInstance = window.MercadoPago
        if (mpInstance.configure) {
          mpInstance.configure({ publicKey })
        }
      }
      
      setMp(mpInstance)
      setSdkLoaded(true)
      console.log('MercadoPago initialized successfully')
    } catch (error) {
      console.error('Error initializing MercadoPago:', error)
      showToast('Error al inicializar MercadoPago', 'error')
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/mercadopago/payment-methods')
      if (response.ok) {
        const methods = await response.json()
        setPaymentMethods(methods)
        if (methods.length > 0) {
          setSelectedMethod(methods[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const validateForm = () => {
    const { cardNumber, expiryMonth, expiryYear, securityCode, cardholderName } = formData
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      showToast('Número de tarjeta inválido', 'error')
      return false
    }
    
    if (!expiryMonth || !expiryYear) {
      showToast('Fecha de vencimiento requerida', 'error')
      return false
    }
    
    if (!securityCode || securityCode.length < 3) {
      showToast('Código de seguridad inválido', 'error')
      return false
    }
    
    if (!cardholderName.trim()) {
      showToast('Nombre del titular requerido', 'error')
      return false
    }

    return true
  }

  const createCardToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mp) {
        reject(new Error('MercadoPago no inicializado'))
        return
      }

      const cardData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        securityCode: formData.securityCode,
        expirationMonth: formData.expiryMonth,
        expirationYear: `20${formData.expiryYear}`,
        cardholderName: formData.cardholderName
      }

      // Usar la API correcta según la versión del SDK
      if (mp.createCardToken) {
        console.log('Creating token with card data:', {
          ...cardData,
          cardNumber: cardData.cardNumber.slice(0, 4) + '****',
          securityCode: '***'
        })
        mp.createCardToken(cardData)
          .then((token: any) => {
            console.log('Token created successfully:', token)
            resolve(token.id)
          })
          .catch((error: any) => {
            console.error('Error creating token:', error)
            reject(new Error(error.message || 'Error al crear token de tarjeta'))
          })
      } else if (window.MercadoPago && window.MercadoPago.createToken) {
        // Fallback para versiones anteriores
        window.MercadoPago.createToken(cardData, (status: number, response: any) => {
          if (status === 200 || status === 201) {
            resolve(response.id)
          } else {
            console.error('Error creating token:', response)
            reject(new Error(response.cause?.[0]?.description || 'Error al crear token de tarjeta'))
          }
        })
      } else {
        reject(new Error('Método de creación de token no disponible'))
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (!sdkLoaded || !mp) {
      showToast('SDK de MercadoPago no cargado. Intenta nuevamente.', 'error')
      return
    }
    
    setLoading(true)

    try {
      // Crear token de la tarjeta
      const cardToken = await createCardToken()

      // Procesar pago
      const response = await fetch('/api/mercadopago/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: cardToken,
          orderId,
          paymentMethodId: selectedMethod,
          installments: formData.installments
        }),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.status === 'approved') {
          showToast('¡Pago aprobado exitosamente!', 'success')
          clearCart()
          onSuccess(result.id)
        } else if (result.status === 'pending') {
          showToast('Pago en proceso de verificación', 'info')
          onSuccess(result.id)
        } else {
          showToast(`Pago rechazado: ${result.detail}`, 'error')
          onError(result.detail || 'Pago rechazado')
        }
      } else {
        throw new Error(result.error || 'Error al procesar el pago')
      }
    } catch (error) {
      console.error('Payment error:', error)
      showToast(error instanceof Error ? error.message : 'Error al procesar el pago', 'error')
      onError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (!sdkLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando MercadoPago...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Información de Pago</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Powered by</span>
          <img 
            src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.92/mercadolibre/logo_small.png" 
            alt="MercadoPago" 
            className="h-6"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Método de Pago */}
        {paymentMethods.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Número de Tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Tarjeta
          </label>
          <Input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>

        {/* Fecha de Vencimiento y CVV */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <select
              value={formData.expiryMonth}
              onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                  {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <select
              value={formData.expiryYear}
              onChange={(e) => handleInputChange('expiryYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">AA</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() + i
                return (
                  <option key={year} value={String(year).slice(-2)}>
                    {String(year).slice(-2)}
                  </option>
                )
              })}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <Input
              type="text"
              value={formData.securityCode}
              onChange={(e) => handleInputChange('securityCode', e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>

        {/* Nombre del Titular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Titular
          </label>
          <Input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="Como aparece en la tarjeta"
            required
          />
        </div>



        {/* Cuotas - Solo para tarjetas de crédito */}
        {selectedMethod && !selectedMethod.includes('debit') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuotas
            </label>
            <select
              value={formData.installments}
              onChange={(e) => handleInputChange('installments', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 cuota sin interés</option>
              <option value={3}>3 cuotas</option>
              <option value={6}>6 cuotas</option>
              <option value={12}>12 cuotas</option>
            </select>
          </div>
        )}

        {/* Información de Seguridad */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center text-green-700 mb-2">
            <Lock className="w-4 h-4 mr-2" />
            <span className="font-medium">Pago 100% Seguro</span>
          </div>
          <p className="text-sm text-green-600">
            Tu información está protegida con encriptación SSL y MercadoPago.
          </p>
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total a Pagar:</span>
            <span className="text-pink-600">${amount.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* Botón de Pago */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
        >
          {loading ? 'Procesando...' : 'Pagar Ahora'}
        </Button>
      </form>

      {/* Tarjetas de Prueba */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center text-yellow-800 mb-2">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="font-medium">Tarjetas de Prueba</span>
        </div>
        <div className="text-sm text-yellow-700 space-y-1">
          <p><strong>Visa (Aprobada):</strong> 4168 8188 4444 7115</p>
          <p><strong>Mastercard (Rechazada):</strong> 5031 7557 3453 0604</p>
          <p><strong>CVV:</strong> 123 | <strong>Fecha:</strong> 11/30 | <strong>Titular:</strong> APRO</p>
        </div>
      </div>
    </div>
  )
} 