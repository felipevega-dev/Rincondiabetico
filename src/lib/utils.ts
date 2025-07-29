import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

export function formatOpeningHours(openingHours: Record<string, unknown>) {
  if (!openingHours) return []

  const hours = []
  
  // Lunes a Viernes
  if ((openingHours.weekdays as { isOpen?: boolean })?.isOpen) {
    const weekdays = openingHours.weekdays as { open: string; close: string }
    hours.push(`Lunes a Viernes: ${weekdays.open} - ${weekdays.close}`)
  } else {
    hours.push('Lunes a Viernes: Cerrado')
  }
  
  // Sábado
  if ((openingHours.saturday as { isOpen?: boolean })?.isOpen) {
    const saturday = openingHours.saturday as { open: string; close: string }
    hours.push(`Sábados: ${saturday.open} - ${saturday.close}`)
  } else {
    hours.push('Sábados: Cerrado')
  }
  
  // Domingo
  if ((openingHours.sunday as { isOpen?: boolean })?.isOpen) {
    const sunday = openingHours.sunday as { open: string; close: string }
    hours.push(`Domingos: ${sunday.open} - ${sunday.close}`)
  } else {
    hours.push('Domingos: Cerrado')
  }
  
  return hours
}
