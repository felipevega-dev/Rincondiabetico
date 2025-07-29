'use client'

import { useState, useEffect, useCallback } from 'react'

interface SalesData {
  summary: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    revenueChange: number
    orderCountChange: number
  }
  topProducts: unknown[]
  topCategories: unknown[]
}

interface ProductsData {
  lowStockProducts: unknown[]
}

interface CustomersData {
  topCustomers: unknown[]
}

interface AnalyticsData {
  sales: SalesData | null
  products: ProductsData | null
  customers: CustomersData | null
}

interface UseAnalyticsOptions {
  period?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { 
    period = '30', 
    autoRefresh = false, 
    refreshInterval = 300000 // 5 minutos
  } = options

  const [data, setData] = useState<AnalyticsData>({
    sales: null,
    products: null,
    customers: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalytics = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)

    try {
      const endpoints = [
        `/api/admin/analytics/sales?period=${period}`,
        `/api/admin/analytics/products?period=${period}`,
        `/api/admin/analytics/customers?period=${period}`
      ]

      const [salesRes, productsRes, customersRes] = await Promise.all(
        endpoints.map(endpoint => fetch(endpoint))
      )

      const newData: AnalyticsData = {
        sales: null,
        products: null,
        customers: null
      }

      if (salesRes.ok) {
        newData.sales = await salesRes.json()
      } else {
        console.error('Error fetching sales analytics:', await salesRes.text())
      }

      if (productsRes.ok) {
        newData.products = await productsRes.json()
      } else {
        console.error('Error fetching products analytics:', await productsRes.text())
      }

      if (customersRes.ok) {
        newData.customers = await customersRes.json()
      } else {
        console.error('Error fetching customers analytics:', await customersRes.text())
      }

      setData(newData)
      setLastUpdated(new Date())

    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Error al cargar las métricas')
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [period])

  // Fetch inicial
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchAnalytics(false) // No mostrar loading en auto-refresh
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchAnalytics])

  const refresh = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const exportData = useCallback(async () => {
    try {
      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
        period: period,
        lastUpdated: lastUpdated?.toISOString()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${period}days-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return true
    } catch (err) {
      console.error('Error exporting data:', err)
      return false
    }
  }, [data, period, lastUpdated])

  // Utilidades para calcular métricas derivadas
  const getMetrics = useCallback(() => {
    if (!data.sales) return null

    const { summary } = data.sales
    
    return {
      // Métricas básicas
      totalRevenue: summary.totalRevenue || 0,
      totalOrders: summary.totalOrders || 0,
      averageOrderValue: summary.averageOrderValue || 0,
      
      // Cambios vs período anterior
      revenueChange: summary.revenueChange || 0,
      orderCountChange: summary.orderCountChange || 0,
      
      // Métricas calculadas
      revenuePerDay: summary.totalRevenue ? summary.totalRevenue / parseInt(period) : 0,
      ordersPerDay: summary.totalOrders ? summary.totalOrders / parseInt(period) : 0,
      
      // Estado del negocio
      isGrowing: summary.revenueChange > 0,
      isShrinking: summary.revenueChange < -5, // Más de 5% de caída
      isStable: Math.abs(summary.revenueChange) <= 5,
    }
  }, [data.sales, period])

  const getTopProducts = useCallback((limit = 5) => {
    return data.sales?.topProducts?.slice(0, limit) || []
  }, [data.sales])

  const getTopCategories = useCallback((limit = 5) => {
    return data.sales?.topCategories?.slice(0, limit) || []
  }, [data.sales])

  const getLowStockProducts = useCallback((limit = 10) => {
    return data.products?.lowStockProducts?.slice(0, limit) || []
  }, [data.products])

  const getTopCustomers = useCallback((limit = 10) => {
    return data.customers?.topCustomers?.slice(0, limit) || []
  }, [data.customers])

  return {
    // Data
    data,
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    refresh,
    exportData,
    
    // Computed properties
    metrics: getMetrics(),
    topProducts: getTopProducts,
    topCategories: getTopCategories,
    lowStockProducts: getLowStockProducts,
    topCustomers: getTopCustomers,
    
    // Status helpers
    hasData: !!(data.sales && data.products && data.customers),
    isEmpty: !data.sales && !data.products && !data.customers,
    isPartialData: !!(data.sales || data.products || data.customers) && 
                   !(data.sales && data.products && data.customers)
  }
}