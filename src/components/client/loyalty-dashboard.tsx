'use client'

import { useState } from 'react'
import { useLoyalty } from '@/hooks/use-loyalty'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  Gift, 
  TrendingUp, 
  History,
  Crown,
  Trophy,
  Award,
  Coins
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface LoyaltyDashboardProps {
  className?: string
}

export function LoyaltyDashboard({ className = '' }: LoyaltyDashboardProps) {
  const { 
    loyaltyData, 
    isLoading, 
    isRedeeming, 
    redeemPoints, 
    getLevelInfo, 
    formatPoints, 
    pointsToClp 
  } = useLoyalty()
  
  const [redeemAmount, setRedeemAmount] = useState('')

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!loyaltyData) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Programa de Lealtad no disponible
        </h3>
        <p className="text-gray-600">
          Realiza tu primera compra para comenzar a ganar puntos.
        </p>
      </div>
    )
  }

  const { points, levelInfo } = loyaltyData
  const currentLevelInfo = getLevelInfo(levelInfo.current)
  const nextLevelInfo = levelInfo.next ? getLevelInfo(levelInfo.next) : null

  const handleRedeem = async () => {
    const pointsToRedeem = parseInt(redeemAmount)
    if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) {
      return
    }

    const success = await redeemPoints(pointsToRedeem)
    if (success) {
      setRedeemAmount('')
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'BRONZE': return <Award className="h-5 w-5" />
      case 'SILVER': return <Trophy className="h-5 w-5" />
      case 'GOLD': return <Crown className="h-5 w-5" />
      case 'VIP': return <Star className="h-5 w-5" />
      default: return <Award className="h-5 w-5" />
    }
  }

  const progressPercentage = levelInfo.next 
    ? Math.min(100, (points.totalPoints / (points.totalPoints + levelInfo.pointsToNext)) * 100)
    : 100

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Puntos Disponibles</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatPoints(points.availablePoints)}
                </p>
                <p className="text-sm text-gray-500">
                  Valor: {formatPrice(pointsToClp(points.availablePoints))}
                </p>
              </div>
              <Coins className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Puntos Totales</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPoints(points.totalPoints)}
                </p>
                <p className="text-sm text-gray-500">
                  Usados: {formatPoints(points.usedPoints)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nivel Actual</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${currentLevelInfo.bgColor} ${currentLevelInfo.color}`}>
                    <span className="flex items-center gap-1">
                      {getLevelIcon(levelInfo.current)}
                      {currentLevelInfo.name}
                    </span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Multiplicador: {levelInfo.multiplier}x
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Level */}
      {nextLevelInfo && levelInfo.pointsToNext > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">
                Progreso al siguiente nivel
              </h3>
              <Badge className={`${nextLevelInfo.bgColor} ${nextLevelInfo.color}`}>
                <span className="flex items-center gap-1">
                  {getLevelIcon(levelInfo.next!)}
                  {nextLevelInfo.name}
                </span>
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Puntos actuales: {formatPoints(points.totalPoints)}</span>
                <span>Faltan: {formatPoints(levelInfo.pointsToNext)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Redeem Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Canjear Puntos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Puntos a canjear
              </label>
              <Input
                type="number"
                placeholder="Ingresa cantidad de puntos"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                min="1"
                max={points.availablePoints}
                className="mt-1"
              />
              {redeemAmount && !isNaN(parseInt(redeemAmount)) && (
                <p className="text-sm text-gray-600 mt-1">
                  Descuento: {formatPrice(pointsToClp(parseInt(redeemAmount)))}
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleRedeem}
              disabled={
                isRedeeming || 
                !redeemAmount || 
                isNaN(parseInt(redeemAmount)) || 
                parseInt(redeemAmount) <= 0 ||
                parseInt(redeemAmount) > points.availablePoints
              }
              className="w-full"
            >
              {isRedeeming ? 'Canjeando...' : 'Canjear Puntos'}
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• {loyaltyData.config.redeemRate} punto = $1 CLP de descuento</p>
              <p>• Los puntos canjeados no se pueden revertir</p>
              <p>• El descuento se aplicará en tu próxima compra</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Últimas Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {points.transactions && points.transactions.length > 0 ? (
              <div className="space-y-3">
                {points.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{formatPoints(transaction.points)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <History className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No hay transacciones aún</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>¿Cómo funciona el programa de lealtad?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ganar Puntos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {loyaltyData.config.earnRate} punto por cada $100 CLP gastados</li>
                <li>• Multiplicador según tu nivel de lealtad</li>
                <li>• Bonificaciones especiales en fechas especiales</li>
                <li>• Los puntos se otorgan al completar la compra</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Niveles de Lealtad</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Bronce:</strong> 0-999 puntos (1x multiplicador)</li>
                <li>• <strong>Plata:</strong> 1,000-4,999 puntos (1.2x multiplicador)</li>
                <li>• <strong>Oro:</strong> 5,000-99,999 puntos (1.5x multiplicador)</li>
                <li>• <strong>VIP:</strong> 100,000+ puntos (2x multiplicador)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}