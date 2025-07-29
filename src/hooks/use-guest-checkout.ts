'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const STORAGE_KEY = 'rincondiabetico_guest_info'

export function useGuestCheckout() {
  const { user, isLoaded } = useUser()
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null)
  const [isGuest, setIsGuest] = useState(false)

  // Cargar información de invitado del localStorage
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        // Usuario autenticado
        setIsGuest(false)
        setGuestInfo(null)
        // Limpiar cualquier información de invitado guardada
        localStorage.removeItem(STORAGE_KEY)
      } else {
        // Usuario no autenticado (invitado)
        setIsGuest(true)
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            setGuestInfo(JSON.parse(stored))
          }
        } catch (error) {
          console.error('Error loading guest info:', error)
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }, [user, isLoaded])

  // Guardar información de invitado
  const saveGuestInfo = (info: GuestInfo) => {
    setGuestInfo(info)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info))
    } catch (error) {
      console.error('Error saving guest info:', error)
    }
  }

  // Limpiar información de invitado
  const clearGuestInfo = () => {
    setGuestInfo(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Obtener información del usuario (autenticado o invitado)
  const getUserInfo = (): GuestInfo | null => {
    if (user) {
      return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        phone: user.phoneNumbers[0]?.phoneNumber || ''
      }
    }
    return guestInfo
  }

  // Verificar si tiene información completa para el checkout
  const hasCompleteInfo = (): boolean => {
    const info = getUserInfo()
    return !!(info?.firstName && info?.lastName && info?.email && info?.phone)
  }

  return {
    isGuest,
    isLoaded,
    guestInfo,
    saveGuestInfo,
    clearGuestInfo,
    getUserInfo,
    hasCompleteInfo,
    user
  }
}