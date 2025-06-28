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

export function formatOpeningHours(openingHours: any) {
  if (!openingHours) return []

  const hours = []
  
  // Lunes a Viernes
  if (openingHours.weekdays?.isOpen) {
    hours.push(`Lunes a Viernes: ${openingHours.weekdays.open} - ${openingHours.weekdays.close}`)
  } else {
    hours.push('Lunes a Viernes: Cerrado')
  }
  
  // Sábado
  if (openingHours.saturday?.isOpen) {
    hours.push(`Sábados: ${openingHours.saturday.open} - ${openingHours.saturday.close}`)
  } else {
    hours.push('Sábados: Cerrado')
  }
  
  // Domingo
  if (openingHours.sunday?.isOpen) {
    hours.push(`Domingos: ${openingHours.sunday.open} - ${openingHours.sunday.close}`)
  } else {
    hours.push('Domingos: Cerrado')
  }
  
  return hours
}
