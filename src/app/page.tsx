import { currentUser } from '@clerk/nextjs/server'
import { isAdmin, getOrCreateUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { HeroCarousel } from '@/components/client/hero-carousel'
import { FeaturedProducts } from '@/components/client/featured-products'
import { RecentlyViewed } from '@/components/client/recently-viewed'
import { Cake, Heart, MapPin, MessageCircle, Instagram, Facebook, House, Sparkles, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Home() {
  const user = await currentUser()
  let userIsAdmin = false
  
  // Solo verificar admin si hay usuario
  if (user) {
    userIsAdmin = await isAdmin()
    // Sincronizar usuario con BD
    await getOrCreateUser()
  }

  // Obtener banners activos
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-cream-100">
      {/* Hero Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-primary-100 via-primary-50 to-cream-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary-300 to-primary-400 blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-accent-300 to-accent-400 blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-secondary-300 to-primary-300 blur-xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroCarousel banners={banners} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gradient-to-br from-secondary-50 via-primary-50 to-primary-100 relative">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-20 right-10 w-28 h-28 rounded-full bg-gradient-to-br from-secondary-300 to-primary-300 blur-lg"></div>
          <div className="absolute bottom-10 left-20 w-36 h-36 rounded-full bg-gradient-to-br from-primary-300 to-primary-400 blur-lg"></div>
        </div>
        <div className="relative z-10">
          <FeaturedProducts />
          
          {/* Productos recientemente vistos */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecentlyViewed 
              title="Continúa explorando"
              limit={6}
            />
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-gradient-to-br from-cream-50 via-accent-50 to-cream-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-32 left-16 w-40 h-40 rounded-full bg-gradient-to-br from-accent-300 to-accent-400 blur-xl"></div>
          <div className="absolute bottom-16 right-32 w-32 h-32 rounded-full bg-gradient-to-br from-cream-300 to-accent-300 blur-xl"></div>
          <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-gradient-to-br from-primary-300 to-accent-300 blur-xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent mb-6">
              Nuestras Especialidades
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección de dulces artesanales, especialmente diseñados para personas con diabetes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Tortas */}
            <Card className="text-center hover:shadow-xl transition-all duration-500 group border-2 hover:border-primary-300 bg-gradient-to-br from-white to-primary-50 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Cake className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-6">
                  Tortas
                </CardTitle>
                <CardDescription className="text-lg mb-8 leading-relaxed text-gray-600">
                  Tortas personalizadas para toda ocasión, sin azúcar refinada
                </CardDescription>
                <Button asChild size="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg group">
                  <Link href="/productos?categoria=tortas">
                    Ver Tortas
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Cupcakes */}
            <Card className="text-center hover:shadow-xl transition-all duration-500 group border-2 hover:border-secondary-300 bg-gradient-to-br from-white to-secondary-50 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent mb-6">
                  Cupcakes
                </CardTitle>
                <CardDescription className="text-lg mb-8 leading-relaxed text-gray-600">
                  Deliciosos cupcakes con decoraciones únicas y sabores especiales
                </CardDescription>
                <Button asChild size="lg" className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-lg group">
                  <Link href="/productos?categoria=cupcakes">
                    Ver Cupcakes
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Dulces */}
            <Card className="text-center hover:shadow-xl transition-all duration-500 group border-2 hover:border-accent-300 bg-gradient-to-br from-white to-accent-50 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent mb-6">
                  Dulces
                </CardTitle>
                <CardDescription className="text-lg mb-8 leading-relaxed text-gray-600">
                  Variedad de dulces y postres artesanales para diabéticos
                </CardDescription>
                <Button asChild size="lg" className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg group">
                  <Link href="/productos?categoria=dulces">
                    Ver Dulces
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/15"></div>
          <div className="absolute top-1/2 right-40 w-24 h-24 rounded-full bg-white/10"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para endulzar tu día?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestros dulces sin azúcar refinada, perfectos para personas con diabetes. 
            ¡Visítanos en Chiguayante!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-white/90 shadow-lg">
              <Link href="/productos">
                <Cake className="h-5 w-5" />
                Ver Productos
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/contacto">
                <MessageCircle className="h-5 w-5" />
                Contáctanos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-24 w-36 h-36 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 blur-xl"></div>
          <div className="absolute bottom-24 right-16 w-44 h-44 rounded-full bg-gradient-to-br from-secondary-300 to-cream-300 blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-cream-300 to-primary-300 blur-xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent mb-6">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conoce las razones que nos hacen únicos en la elaboración de dulces para diabéticos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="text-center hover:shadow-xl transition-all duration-500 group border-2 hover:border-emerald-300 bg-gradient-to-br from-white to-emerald-50 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <House className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Artesanal
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed text-gray-700">
                  Todos nuestros productos son hechos a mano con amor y técnicas tradicionales
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-500 group border-2 hover:border-teal-300 bg-gradient-to-br from-white to-teal-50 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Para Diabéticos
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed text-gray-700">
                  Dulces especialmente diseñados sin azúcar refinada, seguros y deliciosos
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-500 group border-2 hover:border-cyan-300 bg-gradient-to-br from-white to-cyan-50 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Retiro en Tienda
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed text-gray-700">
                  Ubicados en Progreso 393, Chiguayante para tu comodidad
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media & Contact Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 blur-xl"></div>
          <div className="absolute bottom-32 left-16 w-36 h-36 rounded-full bg-gradient-to-br from-blue-300 to-indigo-300 blur-xl"></div>
          <div className="absolute top-1/3 left-1/3 w-28 h-28 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 blur-xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Conéctate con nosotros
            </h2>
            <p className="text-xl text-gray-700">
              Síguenos en redes sociales y mantente al día con nuestras novedades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border-2 hover:border-green-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-semibold text-foreground mb-2">WhatsApp</CardTitle>
                <CardDescription className="text-sm mb-3">Contáctanos directamente</CardDescription>
                <p className="text-green-600 font-medium">+56 9 8687 4406</p>
              </CardContent>
            </Card>

            {/* Instagram */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border-2 hover:border-pink-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-semibold text-foreground mb-2">Instagram</CardTitle>
                <CardDescription className="text-sm mb-3">Ve nuestras creaciones</CardDescription>
                <p className="text-primary font-medium">@dulcespasmino</p>
              </CardContent>
            </Card>

            {/* Facebook */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border-2 hover:border-blue-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Facebook className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-semibold text-foreground mb-2">Facebook</CardTitle>
                <CardDescription className="text-sm mb-3">Síguenos en Facebook</CardDescription>
                <p className="text-blue-600 font-medium">Dulces Pasmiño</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
