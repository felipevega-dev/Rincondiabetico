import { currentUser } from '@clerk/nextjs/server'
import { isAdmin, getOrCreateUser } from '@/lib/auth'
import Link from 'next/link'
import { HeroCarousel } from '@/components/client/hero-carousel'
import { FeaturedProducts } from '@/components/client/featured-products'
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroCarousel />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestros dulces más populares, elaborados especialmente para diabéticos
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Nuestras Especialidades
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección de dulces artesanales, especialmente diseñados para personas con diabetes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Tortas */}
            <Card className="text-center hover:shadow-lg transition-all duration-500 group border-2 hover:border-primary/20 bg-card">
              <CardContent className="p-8 lg:p-10">
                <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Cake className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Tortas
                </CardTitle>
                <CardDescription className="text-lg mb-8 leading-relaxed">
                  Tortas personalizadas para toda ocasión, sin azúcar refinada
                </CardDescription>
                <Button asChild size="lg" className="group">
                  <Link href="/productos?categoria=tortas">
                    Ver Tortas
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Cupcakes */}
            <Card className="text-center hover:shadow-lg transition-all duration-500 group border-2 hover:border-primary/20 bg-card">
              <CardContent className="p-8 lg:p-10">
                <div className="w-24 h-24 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Heart className="h-12 w-12 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Cupcakes
                </CardTitle>
                <CardDescription className="text-lg mb-8 leading-relaxed">
                  Deliciosos cupcakes con decoraciones únicas y sabores especiales
                </CardDescription>
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link href="/productos?categoria=cupcakes">
                    Ver Cupcakes
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Dulces */}
            <Card className="text-center hover:shadow-lg transition-all duration-500 group border-2 hover:border-primary/20 bg-card">
              <CardContent className="p-8 lg:p-10">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Sparkles className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Dulces
                </CardTitle>
                <CardDescription className="text-lg mb-8 leading-relaxed">
                  Variedad de dulces y postres artesanales para diabéticos
                </CardDescription>
                <Button asChild size="lg" variant="outline" className="group">
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
      <section className="py-20 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
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
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
              <Link href="/productos">
                <Cake className="h-5 w-5" />
                Ver Productos
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contacto">
                <MessageCircle className="h-5 w-5" />
                Contáctanos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Conoce las razones que nos hacen únicos en la elaboración de dulces para diabéticos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="text-center hover:shadow-lg transition-all duration-500 group border-2 hover:border-accent/20">
              <CardContent className="p-8 lg:p-10">
                <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <House className="h-10 w-10 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
                  Artesanal
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Todos nuestros productos son hechos a mano con amor y técnicas tradicionales
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-500 group border-2 hover:border-primary/20">
              <CardContent className="p-8 lg:p-10">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Heart className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
                  Para Diabéticos
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Dulces especialmente diseñados sin azúcar refinada, seguros y deliciosos
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-500 group border-2 hover:border-primary/20">
              <CardContent className="p-8 lg:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <MapPin className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
                  Retiro en Tienda
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Ubicados en Progreso 393, Chiguayante para tu comodidad
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media & Contact Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Conéctate con nosotros
            </h2>
            <p className="text-xl text-muted-foreground">
              Síguenos en redes sociales y mantente al día con nuestras novedades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

            {/* Horarios */}
            <Card className="text-center border-2">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="font-semibold text-foreground mb-2">Horarios</CardTitle>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p><strong>Lun-Vie:</strong> 9:00-19:00</p>
                  <p><strong>Sáb:</strong> 9:00-17:00</p>
                  <p><strong>Dom:</strong> 10:00-15:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
