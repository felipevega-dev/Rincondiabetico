'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface AnalyticsSummaryCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  format?: 'currency' | 'number' | 'percentage'
  subtitle?: string
}

export function AnalyticsSummaryCard({ 
  title, 
  value, 
  change, 
  icon, 
  format = 'number',
  subtitle 
}: AnalyticsSummaryCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'currency':
        return formatPrice(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'number':
      default:
        return val.toLocaleString('es-CL')
    }
  }

  const renderTrendIcon = (changeValue: number) => {
    if (changeValue > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (changeValue < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (changeValue: number) => {
    if (changeValue > 0) return 'text-green-600'
    if (changeValue < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            {icon}
          </div>
        </div>
        
        {change !== undefined && (
          <div className="flex items-center mt-4">
            {renderTrendIcon(change)}
            <span className={`text-sm font-medium ml-2 ${getTrendColor(change)}`}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs período anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}