'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Tag,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  type: string
  status: string
  discountValue: number
  maxDiscountAmount?: number
  minOrderAmount?: number
  maxUses?: number
  maxUsesPerUser?: number
  usedCount: number
  validFrom: string
  validUntil?: string
  isStackable: boolean
  isPublic: boolean
  autoApply: boolean
  createdAt: string
  usageCount: number
  orderCount: number
}

interface CouponsResponse {
  coupons: Coupon[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  EXPIRED: 'bg-red-100 text-red-800',
  USED_UP: 'bg-orange-100 text-orange-800'
}

const typeLabels = {
  PERCENTAGE: 'Porcentaje',
  FIXED_AMOUNT: 'Monto fijo',
  FREE_SHIPPING: 'Envío gratis',
  PRODUCT_SPECIFIC: 'Producto específico'
}

export default function CouponsAdminPage() {
  // const router = useRouter() // Removed as unused
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  })

  useEffect(() => {
    fetchCoupons()
  }, [currentPage, statusFilter, search])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (statusFilter) params.append('status', statusFilter)
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/coupons?${params}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar cupones')
      }

      const data: CouponsResponse = await response.json()
      setCoupons(data.coupons)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error('Error al cargar cupones')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchCoupons()
  }

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el cupón "${code}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar cupón')
      }

      toast.success('Cupón eliminado correctamente')
      fetchCoupons()
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast.error(error instanceof Error ? error.message : 'Error al eliminar cupón')
    }
  }

  const getUsagePercentage = (coupon: Coupon) => {
    if (!coupon.maxUses) return null
    return Math.round((coupon.usedCount / coupon.maxUses) * 100)
  }

  const isExpiredSoon = (coupon: Coupon) => {
    if (!coupon.validUntil) return false
    const expiryDate = new Date(coupon.validUntil)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return expiryDate <= threeDaysFromNow && expiryDate > new Date()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cupones y Descuentos</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  // Estadísticas rápidas
  const totalCoupons = pagination.total
  const activeCoupons = coupons.filter(c => c.status === 'ACTIVE').length
  const totalUsages = coupons.reduce((sum, c) => sum + c.usageCount, 0)
  const expiringSoon = coupons.filter(isExpiredSoon).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cupones y Descuentos</h1>
          <p className="text-gray-600">Gestiona cupones, descuentos y promociones</p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cupón
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cupones</p>
                <p className="text-2xl font-bold">{totalCoupons}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cupones Activos</p>
                <p className="text-2xl font-bold text-green-600">{activeCoupons}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usos</p>
                <p className="text-2xl font-bold">{totalUsages}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiran Pronto</p>
                <p className="text-2xl font-bold text-orange-600">{expiringSoon}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por código o nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
              <option value="EXPIRED">Expirados</option>
              <option value="USED_UP">Agotados</option>
            </select>

            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cupones</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay cupones
              </h3>
              <p className="text-gray-600 mb-6">
                {search || statusFilter
                  ? 'No se encontraron cupones con los filtros aplicados'
                  : 'Aún no has creado ningún cupón'
                }
              </p>
              <Button asChild>
                <Link href="/admin/coupons/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer cupón
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Código y nombre */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono">
                          {coupon.code}
                        </Badge>
                        <Badge className={statusColors[coupon.status as keyof typeof statusColors]}>
                          {coupon.status}
                        </Badge>
                      </div>
                      <p className="font-medium text-gray-900">{coupon.name}</p>
                      <p className="text-sm text-gray-600">{typeLabels[coupon.type as keyof typeof typeLabels]}</p>
                    </div>

                    {/* Descuento */}
                    <div>
                      <p className="text-sm text-gray-600">Descuento</p>
                      <p className="font-medium">
                        {coupon.type === 'PERCENTAGE' 
                          ? `${coupon.discountValue}%`
                          : formatPrice(coupon.discountValue)
                        }
                      </p>
                      {coupon.minOrderAmount && (
                        <p className="text-xs text-gray-500">
                          Mín: {formatPrice(coupon.minOrderAmount)}
                        </p>
                      )}
                    </div>

                    {/* Uso */}
                    <div>
                      <p className="text-sm text-gray-600">Usos</p>
                      <p className="font-medium">
                        {coupon.usedCount}
                        {coupon.maxUses && ` / ${coupon.maxUses}`}
                      </p>
                      {coupon.maxUses && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full"
                            style={{ width: `${getUsagePercentage(coupon)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Validez */}
                    <div>
                      <p className="text-sm text-gray-600">Validez</p>
                      <p className="text-sm">
                        {new Date(coupon.validFrom).toLocaleDateString('es-CL')}
                        {coupon.validUntil && (
                          <>
                            <br />
                            <span className={isExpiredSoon(coupon) ? 'text-orange-600' : ''}>
                              hasta {new Date(coupon.validUntil).toLocaleDateString('es-CL')}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/coupons/${coupon.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/coupons/${coupon.id}/editar`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              {[...Array(pagination.pages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                disabled={currentPage === pagination.pages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}