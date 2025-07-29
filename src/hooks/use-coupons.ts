'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

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

interface CartItem {
  productId: string
  categoryId: string
  quantity: number
  price: number
}

interface UseCouponsProps {
  cartTotal: number
  cartItems: CartItem[]
  persistKey?: string // Para persistir en localStorage
}

export function useCoupons({ cartTotal, cartItems, persistKey = 'applied-coupons' }: UseCouponsProps) {
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Cargar cupones desde localStorage al iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(persistKey)
      if (saved) {
        const coupons = JSON.parse(saved)
        setAppliedCoupons(coupons)
      }
    } catch (error) {
      console.error('Error loading saved coupons:', error)
      localStorage.removeItem(persistKey)
    }
  }, [persistKey])

  // Guardar cupones en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(persistKey, JSON.stringify(appliedCoupons))
    } catch (error) {
      console.error('Error saving coupons:', error)
    }
  }, [appliedCoupons, persistKey])

  // Validar cupón
  const validateCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      toast.error('Ingresa un código de cupón')
      return false
    }

    // Verificar si ya está aplicado
    if (appliedCoupons.some(c => c.code.toLowerCase() === code.toLowerCase())) {
      toast.error('Este cupón ya está aplicado')
      return false
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          cartTotal,
          cartItems
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al validar cupón')
        return false
      }

      if (data.valid) {
        return addCoupon({
          id: data.coupon.id,
          code: data.coupon.code,
          name: data.coupon.name,
          description: data.coupon.description,
          type: data.coupon.type,
          discountValue: data.coupon.discountValue,
          discountAmount: data.discountAmount,
          isStackable: data.coupon.isStackable
        })
      } else {
        toast.error(data.error || 'Cupón no válido')
        return false
      }
    } catch (error) {
      console.error('Error validating coupon:', error)
      toast.error('Error al validar el cupón')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Agregar cupón
  const addCoupon = (coupon: AppliedCoupon): boolean => {
    // Verificar stackability
    const hasNonStackableCoupons = appliedCoupons.some(c => !c.isStackable)
    
    if (appliedCoupons.length > 0 && (!coupon.isStackable || hasNonStackableCoupons)) {
      toast.error('Este cupón no se puede combinar con otros cupones aplicados')
      return false
    }

    setAppliedCoupons(prev => [...prev, coupon])
    return true
  }

  // Remover cupón
  const removeCoupon = (couponId: string) => {
    setAppliedCoupons(prev => prev.filter(c => c.id !== couponId))
  }

  // Limpiar todos los cupones
  const clearCoupons = () => {
    setAppliedCoupons([])
  }

  // Re-validar todos los cupones (útil cuando cambia el carrito)
  const revalidateCoupons = async () => {
    if (appliedCoupons.length === 0) return

    setIsLoading(true)
    const validCoupons: AppliedCoupon[] = []

    for (const coupon of appliedCoupons) {
      try {
        const response = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: coupon.code,
            cartTotal,
            cartItems
          })
        })

        const data = await response.json()

        if (response.ok && data.valid) {
          validCoupons.push({
            ...coupon,
            discountAmount: data.discountAmount
          })
        } else {
          toast.error(`Cupón "${coupon.code}" ya no es válido: ${data.error}`)
        }
      } catch (error) {
        console.error(`Error revalidating coupon ${coupon.code}:`, error)
        toast.error(`Error al re-validar cupón "${coupon.code}"`)
      }
    }

    setAppliedCoupons(validCoupons)
    setIsLoading(false)
  }

  // Calcular descuento total
  const totalDiscount = appliedCoupons.reduce((total, coupon) => total + coupon.discountAmount, 0)

  // Calcular total final
  const finalTotal = Math.max(0, cartTotal - totalDiscount)

  // Obtener códigos aplicados para enviar en el pedido
  const appliedCouponCodes = appliedCoupons.map(c => c.code)
  const appliedCouponIds = appliedCoupons.map(c => c.id)

  return {
    appliedCoupons,
    totalDiscount,
    finalTotal,
    appliedCouponCodes,
    appliedCouponIds,
    isLoading,
    validateCoupon,
    addCoupon,
    removeCoupon,
    clearCoupons,
    revalidateCoupons
  }
}