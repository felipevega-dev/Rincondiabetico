import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Users, Award, Heart, Star, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotros - Dulces Pasmiño',
  description: 'Conoce la historia de Dulces Pasmiño, nuestra pasión por crear postres deliciosos y saludables en Chiguayante, Chile.',
}

const stats = [
  {
    value: '1000+',
    label: 'Clientes Felices',
    icon: Users,
  },
  {
    value: '50+',
    label: 'Recetas Únicas',
    icon: Heart,
  },
  {
    value: '4.9',
    label: 'Rating Promedio',
    icon: Star,
  },
  {
    value: '24h',
    label: 'Preparación Fresca',
    icon: Clock,
  },
]

const timeline = [
  {
    year: '2023',
    title: 'El Comienzo',
    description: 'Abrimos nuestras puertas en Chiguayante con la misión de crear postres deliciosos para diabéticos.'
  },
  {
    year: '2023',
    title: 'Primeras Recetas',
    description: 'Desarrollamos nuestra línea inicial de postres sin azúcar refinada.'
  },
  {
    year: '2024',
    title: 'Expansión Digital',
    description: 'Lanzamos nuestra plataforma de pedidos online para mejor servicio.'
  },
  {
    year: '2024',
    title: 'Innovación Continua',
    description: 'Seguimos innovando con nuevas recetas y opciones saludables.'
  },
]

const testimonials = [
  {
    name: 'María González',
    role: 'Cliente desde 2023',
    content: 'Por fin puedo disfrutar de postres deliciosos sin preocuparme por mi diabetes. ¡Los postres de Dulces Pasmiño son increíbles!',
    image: '/testimonials/maria.jpg'
  },
  {
    name: 'Carlos Pérez',
    role: 'Cliente desde 2023',
    content: 'La calidad y el sabor son excepcionales. Dulces Pasmiño ha revolucionado los postres saludables.',
    image: '/testimonials/carlos.jpg'
  },
  {
    name: 'Ana Silva',
    role: 'Nutricionista',
    content: 'Recomiendo Dulces Pasmiño a mis pacientes. Sus postres son verdaderamente aptos para diabéticos.',
    image: '/testimonials/ana.jpg'
  },
]

const certifications = [
  {
    title: 'Certificación de Manipulación de Alimentos',
    description: 'Todo nuestro equipo está certificado en manipulación segura de alimentos',
    icon: Award
  },
  {
    title: 'Resolución Sanitaria',
    description: 'Cumplimos con todas las normas sanitarias vigentes',
    icon: Award
  },
  {
    title: 'Miembros de la Asociación de Diabéticos',
    description: 'Colaboramos activamente con la comunidad diabética',
    icon: Award
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section con Parallax */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/uploads/products/209d9797-1ea7-4a8e-9c6b-e6de937105a5.png"
            alt="Postres Dulces Pasmiño"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-50/90" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-up">
              Sobre Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto animate-fade-up animation-delay-100">
              En Dulces Pasmiño, creemos que todos merecen disfrutar de postres deliciosos, 
              sin importar sus restricciones alimentarias.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg transform hover:scale-105 transition-transform"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-pink-500" />
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historia Timeline */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nuestra Historia
          </h2>
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-8 mb-8">
                <div className="w-32 pt-2">
                  <div className="text-xl font-bold text-pink-500">{item.year}</div>
                </div>
                <div className="flex-1 relative pb-8">
                  <div className="absolute top-0 left-0 h-full w-px bg-pink-200" />
                  <div className="relative pl-8">
                    <div className="absolute -left-2 top-2 w-4 h-4 rounded-full bg-pink-500" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Misión y Valores con Iconos Animados */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-2xl animate-bounce-soft">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Misión</h3>
              <p className="text-gray-600">
                Crear postres deliciosos y saludables que permitan a las personas con diabetes 
                y restricciones alimentarias disfrutar sin culpa.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-2xl animate-bounce-soft">💚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestros Valores</h3>
              <p className="text-gray-600">
                Calidad, innovación y compromiso con la salud. Cada producto es elaborado 
                con ingredientes naturales y técnicas artesanales.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-2xl animate-bounce-soft">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Visión</h3>
              <p className="text-gray-600">
                Ser la referencia en postres saludables en Chile, expandiendo el acceso 
                a opciones dulces para todos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios con Carrusel */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform"
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificaciones y Reconocimientos */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Certificaciones y Reconocimientos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div 
                key={cert.title}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 text-center"
              >
                <cert.icon className="h-12 w-12 mx-auto mb-6 text-pink-500" />
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{cert.title}</h3>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Mejorado */}
      <div className="py-16 bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            ¿Listo para probar nuestros postres?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Descubre nuestra selección de postres artesanales, especialmente diseñados 
            para personas con diabetes y restricciones alimentarias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transform hover:scale-105 transition-all shadow-lg"
            >
              Ver Nuestros Productos
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-pink-500 font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all shadow-lg"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 