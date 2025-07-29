'use client'

import { useCart } from '@/components/providers/cart-provider'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockValidationAlert } from '@/components/client/stock-validation-alert'
import { CouponInput } from '@/components/client/coupon-input'
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, Users, Cookie } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface AppliedCoupon {
  id: string
  code: string
  name: string
  description?: string
  type: string
  discountValue: number
  discountAmount: number
  isStackable: boolean
}

export default function CartPage() {
  const { items, isLoaded, updateQuantity, removeItem, clearCart, itemCount, subtotal, total } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>([])

  // Calcular total con descuentos
  const totalDiscount = appliedCoupons.reduce((sum, coupon) => sum + coupon.discountAmount, 0)
  const finalTotal = Math.max(0, total - totalDiscount)

  // Preparar items del carrito para validación de cupones
  const cartItems = items.map(item => ({
    productId: item.productId,
    categoryId: item.categoryId || '',
    quantity: item.quantity,
    price: item.price
  }))

  const handleCouponApplied = (coupon: AppliedCoupon) => {
    setAppliedCoupons(prev => [...prev, coupon])
  }

  const handleCouponRemoved = (couponId: string) => {
    setAppliedCoupons(prev => prev.filter(c => c.id !== couponId))
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity)
  }

  const handleCheckout = () => {
    // Guardar cupones aplicados en localStorage para el checkout
    if (appliedCoupons.length > 0) {
      localStorage.setItem('applied-coupons', JSON.stringify(appliedCoupons))
    }
    window.location.href = '/checkout'
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8">
              ¡Descubre nuestros deliciosos postres y agrega algunos a tu carrito!
            </p>
            <Button asChild size="lg">
              <Link href="/productos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 text-primary hover:text-primary/80">
            <Link href="/productos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar comprando
            </Link>
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tu Carrito</h1>
              <p className="text-muted-foreground mt-1">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
            
            {items.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                Vaciar carrito
              </Button>
            )}
          </div>
        </div>

        {/* Stock Validation Alert */}
        <StockValidationAlert />

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Productos</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-6"
                      data-item-id={item.id}
                      data-product-id={item.productId}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-20 h-20">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-lg border border-border"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border border-border">
                              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-foreground">
                                {item.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {formatPrice(item.price)} c/u
                              </p>
                              
                              {/* Mostrar variaciones si existen */}
                              {item.variations && item.variations.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {item.variations.map((variation, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                      {variation.type === 'SIZE' ? (
                                        <Users className="h-3 w-3" />
                                      ) : (
                                        <Cookie className="h-3 w-3" />
                                      )}
                                      <span>{variation.name}</span>
                                      {variation.priceChange !== 0 && (
                                        <span className={`text-xs ${
                                          variation.priceChange > 0 ? 'text-orange-600' : 'text-green-600'
                                        }`}>
                                          ({variation.priceChange > 0 ? '+' : ''}{formatPrice(variation.priceChange)})
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 h-8 text-center border-0 focus:ring-0"
                                />
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="text-lg font-medium text-foreground min-w-[100px] text-right">
                                {formatPrice(item.price * item.quantity)}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 lg:mt-0 space-y-6">
            {/* Sección de Cupones */}
            <Card>
              <CardContent className="p-6">
                <CouponInput
                  cartTotal={total}
                  cartItems={cartItems}
                  appliedCoupons={appliedCoupons}
                  onCouponApplied={handleCouponApplied}
                  onCouponRemoved={handleCouponRemoved}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {/* Mostrar descuentos de cupones */}
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuentos aplicados</span>
                      <span>-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Retiro en tienda</span>
                    <span>Gratis</span>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">{formatPrice(finalTotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="text-sm text-muted-foreground text-right mt-1">
                        <span className="line-through">{formatPrice(total)}</span>
                        <span className="ml-2 text-green-600 font-medium">
                          ¡Ahorras {formatPrice(totalDiscount)}!
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                        Procesando...
                      </div>
                    ) : (
                      'Proceder al Pago'
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      * Solo retiro en tienda física
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Chiguayante, Chile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-medium text-primary mb-2">
                  Información de Retiro
                </h3>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>• Retiro solo en tienda física</li>
                  <li>• Coordinaremos fecha y hora contigo</li>
                  <li>• Productos frescos preparados al momento</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 