'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Tag, 
  X, 
  Check, 
  Loader2,
  Gift,
  Percent,
  DollarSign
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface CartItem {
  productId: string
  categoryId: string
  quantity: number
  price: number
}

interface AppliedCoupon {
  id: string
  code: string
  name: string
  description?: string
  type: string
  discountValue: number
  discountAmount: number
  isStackable: boolean
}

interface CouponInputProps {
  cartTotal: number
  cartItems: CartItem[]
  appliedCoupons: AppliedCoupon[]
  onCouponApplied: (coupon: AppliedCoupon) => void
  onCouponRemoved: (couponId: string) => void
  className?: string
}

export function CouponInput({
  cartTotal,
  cartItems,
  appliedCoupons,
  onCouponApplied,
  onCouponRemoved,
  className = ''
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Ingresa un código de cupón')
      return
    }

    // Verificar si el cupón ya está aplicado
    if (appliedCoupons.some(c => c.code.toLowerCase() === couponCode.toLowerCase())) {
      toast.error('Este cupón ya está aplicado')
      return
    }

    setIsValidating(true)
    
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartTotal,
          cartItems
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al validar cupón')
        return
      }

      if (data.valid) {
        // Verificar si se puede stackear con cupones existentes
        const hasNonStackableCoupons = appliedCoupons.some(c => !c.isStackable)
        
        if (appliedCoupons.length > 0 && (!data.coupon.isStackable || hasNonStackableCoupons)) {
          toast.error('Este cupón no se puede combinar con otros cupones aplicados')
          return
        }

        const appliedCoupon: AppliedCoupon = {
          id: data.coupon.id,
          code: data.coupon.code,
          name: data.coupon.name,
          description: data.coupon.description,
          type: data.coupon.type,
          discountValue: data.coupon.discountValue,
          discountAmount: data.discountAmount,
          isStackable: data.coupon.isStackable
        }

        onCouponApplied(appliedCoupon)
        setCouponCode('')
        toast.success(`¡Cupón "${data.coupon.code}" aplicado! Descuento: ${formatPrice(data.discountAmount)}`)
      } else {
        toast.error(data.error || 'Cupón no válido')
      }
    } catch (error) {
      console.error('Error validating coupon:', error)
      toast.error('Error al validar el cupón')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = (couponId: string, couponCode: string) => {
    onCouponRemoved(couponId)
    toast.success(`Cupón "${couponCode}" removido`)
  }

  const getDiscountIcon = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return <Percent className="h-4 w-4" />
      case 'FIXED_AMOUNT':
        return <DollarSign className="h-4 w-4" />
      case 'FREE_SHIPPING':
        return <Gift className="h-4 w-4" />
      case 'PRODUCT_SPECIFIC':
        return <Tag className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  const getDiscountText = (coupon: AppliedCoupon) => {
    switch (coupon.type) {
      case 'PERCENTAGE':
        return `${coupon.discountValue}% de descuento`
      case 'FIXED_AMOUNT':
        return `${formatPrice(coupon.discountValue)} de descuento`
      case 'FREE_SHIPPING':
        return 'Envío gratis'
      case 'PRODUCT_SPECIFIC':
        return `Descuento en productos específicos`
      default:
        return 'Descuento aplicado'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input para nuevo cupón */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">¿Tienes un cupón de descuento?</span>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ingresa tu código de cupón"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleValidateCoupon()}
            className="flex-1"
            disabled={isValidating}
          />
          <Button
            onClick={handleValidateCoupon}
            disabled={isValidating || !couponCode.trim()}
            variant="outline"
            className="shrink-0"
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isValidating ? 'Validando...' : 'Aplicar'}
          </Button>
        </div>
      </div>

      {/* Cupones aplicados */}
      {appliedCoupons.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Cupones aplicados:</div>
          
          <div className="space-y-2">
            {appliedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-green-600">
                    {getDiscountIcon(coupon.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {coupon.code}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {coupon.name}
                      </span>
                    </div>
                    
                    <div className="text-xs text-green-700 mt-1">
                      {getDiscountText(coupon)} • Ahorro: {formatPrice(coupon.discountAmount)}
                    </div>
                    
                    {coupon.description && (
                      <div className="text-xs text-gray-600 mt-1">
                        {coupon.description}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveCoupon(coupon.id, coupon.code)}
                  className="text-gray-500 hover:text-red-500 p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Resumen de descuentos */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total de descuentos:</span>
              <span className="font-medium text-green-600">
                -{formatPrice(appliedCoupons.reduce((total, coupon) => total + coupon.discountAmount, 0))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje informativo sobre combinación de cupones */}
      {appliedCoupons.length > 0 && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          {appliedCoupons.some(c => !c.isStackable)
            ? '💡 Este cupón no se puede combinar con otros cupones.'
            : '💡 Puedes agregar más cupones que se puedan combinar.'
          }
        </div>
      )}
    </div>
  )
}