'use client'

import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'
import { Button } from './button'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 3000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type]

  const icon = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    info: <CheckCircle className="h-5 w-5" />
  }[type]

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-slide-up">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px]`}>
        <div className="animate-bounce-soft">
          {icon}
        </div>
        <span className="flex-1 font-medium">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 h-6 w-6 p-0 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

 