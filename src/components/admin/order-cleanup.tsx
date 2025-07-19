'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CleanupStats {
  expiredDraftOrders: number
  expiredPendingOrders: number
  totalDraftOrders: number
  totalPendingOrders: number
  needsCleanup: boolean
}

interface CleanupResult {
  deletedDraftOrders: number
  expiredPendingOrders: number
  errors: string[]
}

export default function OrderCleanup() {
  const [stats, setStats] = useState<CleanupStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [cleaning, setCleaning] = useState(false)
  const [lastCleanup, setLastCleanup] = useState<CleanupResult | null>(null)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/cleanup')
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching cleanup stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeCleanup = async () => {
    setCleaning(true)
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setLastCleanup(data.data)
        // Refrescar estadísticas después de la limpieza
        await fetchStats()
      }
    } catch (error) {
      console.error('Error executing cleanup:', error)
    } finally {
      setCleaning(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Refrescar estadísticas cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Limpieza de Órdenes
        </h3>
        <Button
          onClick={executeCleanup}
          disabled={cleaning || !stats?.needsCleanup}
          className="bg-red-600 hover:bg-red-700"
        >
          {cleaning ? 'Limpiando...' : 'Ejecutar Limpieza'}
        </Button>
      </div>

      {stats && (
        <div className="space-y-4">
          {/* Estadísticas actuales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-orange-600">
                Órdenes Draft Expiradas
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {stats.expiredDraftOrders}
              </p>
              <p className="text-xs text-orange-600">
                de {stats.totalDraftOrders} total
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-yellow-600">
                Órdenes Pendientes Expiradas
              </p>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.expiredPendingOrders}
              </p>
              <p className="text-xs text-yellow-600">
                de {stats.totalPendingOrders} total
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-600">
                Total Draft
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.totalDraftOrders}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-600">
                Total Pendientes
              </p>
              <p className="text-2xl font-bold text-green-900">
                {stats.totalPendingOrders}
              </p>
            </div>
          </div>

          {/* Estado de limpieza */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              stats.needsCleanup ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              stats.needsCleanup ? 'text-red-600' : 'text-green-600'
            }`}>
              {stats.needsCleanup ? 'Limpieza necesaria' : 'Sistema limpio'}
            </span>
          </div>

          {/* Información sobre la limpieza */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Política de Limpieza Automática
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Órdenes DRAFT se eliminan después de 15 minutos</li>
              <li>• Órdenes PENDIENTE se cancelan después de 24 horas</li>
              <li>• La limpieza se ejecuta automáticamente cada 30 minutos</li>
            </ul>
          </div>

          {/* Resultado de la última limpieza */}
          {lastCleanup && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">
                Última Limpieza Ejecutada
              </h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>• {lastCleanup.deletedDraftOrders} órdenes DRAFT eliminadas</p>
                <p>• {lastCleanup.expiredPendingOrders} órdenes PENDIENTE canceladas</p>
                {lastCleanup.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-600 font-medium">Errores:</p>
                    {lastCleanup.errors.map((error, index) => (
                      <p key={index} className="text-red-600 text-xs">• {error}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}