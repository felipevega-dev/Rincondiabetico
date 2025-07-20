'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

export interface LoyaltyPoints {
  id: string
  userId: string
  totalPoints: number
  availablePoints: number
  usedPoints: number
  level: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP'
  createdAt: string
  updatedAt: string
  transactions: PointTransaction[]
}

export interface PointTransaction {
  id: string
  loyaltyId: string
  type: 'EARNED_PURCHASE' | 'REDEEMED_DISCOUNT' | 'BONUS' | 'EXPIRED'
  points: number
  description: string
  reference?: string
  createdAt: string
}

export interface LoyaltyLevel {
  current: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP'
  next: 'SILVER' | 'GOLD' | 'VIP' | null
  pointsToNext: number
  multiplier: number
}

export interface LoyaltyConfig {
  earnRate: number  // Puntos por cada 100 CLP
  redeemRate: number // CLP por punto
}

export interface LoyaltyData {
  points: LoyaltyPoints
  levelInfo: LoyaltyLevel
  config: LoyaltyConfig
}

export function useLoyalty() {
  const { user } = useUser()
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  // Cargar datos de lealtad
  const fetchLoyaltyData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/loyalty/points')
      if (response.ok) {
        const data = await response.json()
        setLoyaltyData(data)
      } else {
        console.error('Error fetching loyalty data')
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error)
      toast.error('Error al cargar puntos de lealtad')
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar datos al montar y cuando el usuario cambie
  useEffect(() => {
    fetchLoyaltyData()
  }, [user])

  // Canjear puntos por descuento
  const redeemPoints = async (points: number, orderId?: string): Promise<boolean> => {
    if (!loyaltyData) return false

    if (loyaltyData.points.availablePoints < points) {
      toast.error('No tienes suficientes puntos disponibles')
      return false
    }

    setIsRedeeming(true)
    try {
      const response = await fetch('/api/loyalty/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, orderId })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`¡${points} puntos canjeados por descuento de $${result.discountAmount.toLocaleString('es-CL')}!`)
        // Actualizar datos locales
        await fetchLoyaltyData()
        return true
      } else {
        toast.error(result.error || 'Error al canjear puntos')
        return false
      }
    } catch (error) {
      console.error('Error redeeming points:', error)
      toast.error('Error al canjear puntos')
      return false
    } finally {
      setIsRedeeming(false)
    }
  }

  // Función helper para obtener información del nivel
  const getLevelInfo = (level: string) => {
    const levels = {
      BRONZE: { name: 'Bronce', color: 'text-orange-600', bgColor: 'bg-orange-100', min: 0, max: 999 },
      SILVER: { name: 'Plata', color: 'text-gray-600', bgColor: 'bg-gray-100', min: 1000, max: 4999 },
      GOLD: { name: 'Oro', color: 'text-yellow-600', bgColor: 'bg-yellow-100', min: 5000, max: 99999 },
      VIP: { name: 'VIP', color: 'text-purple-600', bgColor: 'bg-purple-100', min: 100000, max: Infinity }
    }
    return levels[level as keyof typeof levels] || levels.BRONZE
  }

  // Función helper para formatear puntos
  const formatPoints = (points: number) => {
    return points.toLocaleString('es-CL')
  }

  // Función helper para calcular valor en pesos
  const pointsToClp = (points: number) => {
    if (!loyaltyData) return 0
    return points * loyaltyData.config.redeemRate
  }

  // Función helper para calcular puntos desde pesos
  const clpToPoints = (clp: number) => {
    if (!loyaltyData) return 0
    return Math.floor(clp / loyaltyData.config.redeemRate)
  }

  return {
    loyaltyData,
    isLoading,
    isRedeeming,
    redeemPoints,
    fetchLoyaltyData,
    getLevelInfo,
    formatPoints,
    pointsToClp,
    clpToPoints,
    // Shortcuts para acceso directo
    points: loyaltyData?.points,
    levelInfo: loyaltyData?.levelInfo,
    config: loyaltyData?.config
  }
}