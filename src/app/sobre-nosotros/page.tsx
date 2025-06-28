import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nosotros - Rincón Diabético',
  description: 'Conoce la historia de Rincón Diabético, nuestra pasión por crear postres deliciosos y saludables en Chiguayante, Chile.',
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En Rincón Diabético, creemos que todos merecen disfrutar de postres deliciosos, 
            sin importar sus restricciones alimentarias.
          </p>
        </div>

        {/* Historia Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Rincón Diabético nació en Chiguayante con una misión clara: crear postres 
                extraordinarios que puedan ser disfrutados por personas con diabetes y 
                aquellos que buscan opciones más saludables.
              </p>
              <p>
                Fundada por una familia apasionada por la repostería, nuestra historia 
                comenzó cuando uno de nuestros seres queridos fue diagnosticado con diabetes. 
                En lugar de renunciar a los dulces, decidimos innovar y crear alternativas 
                deliciosas y seguras.
              </p>
              <p>
                Hoy, somos el destino favorito en Chiguayante para quienes buscan postres 
                sin azúcar refinada, bajos en carbohidratos y llenos de sabor.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Desde 2023
              </h3>
              <p className="text-gray-600">
                Endulzando vidas en Chiguayante con postres saludables y deliciosos
              </p>
            </div>
          </div>
        </div>

        {/* Misión y Valores */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Misión</h3>
            <p className="text-gray-600">
              Crear postres deliciosos y saludables que permitan a las personas con diabetes 
              y restricciones alimentarias disfrutar sin culpa.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestros Valores</h3>
            <p className="text-gray-600">
              Calidad, innovación y compromiso con la salud. Cada producto es elaborado 
              con ingredientes naturales y técnicas artesanales.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌟</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Visión</h3>
            <p className="text-gray-600">
              Ser la referencia en postres saludables en Chile, expandiendo el acceso 
              a opciones dulces para todos.
            </p>
          </div>
        </div>

        {/* Compromiso */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestro Compromiso</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🌱 Ingredientes Naturales</h4>
                <p className="text-gray-600 mb-6">
                  Utilizamos solo edulcorantes naturales como stevia, eritritol y fruta del monje. 
                  Sin azúcar refinada, sin conservantes artificiales.
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">👩‍🍳 Elaboración Artesanal</h4>
                <p className="text-gray-600">
                  Cada postre es elaborado a mano con técnicas tradicionales de repostería, 
                  adaptadas para crear opciones más saludables.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🏥 Asesoría Nutricional</h4>
                <p className="text-gray-600 mb-6">
                  Trabajamos con nutricionistas para asegurar que nuestros productos 
                  sean seguros y nutritivos para personas con diabetes.
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">🏪 Atención Personalizada</h4>
                <p className="text-gray-600">
                  En nuestra tienda en Chiguayante, ofrecemos atención personalizada 
                  y asesoría sobre nuestros productos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¿Listo para probar nuestros postres?
          </h2>
          <p className="text-gray-600 mb-8">
            Visítanos en nuestra tienda en Chiguayante o explora nuestro catálogo online
          </p>
          <div className="space-x-4">
            <a
              href="/productos"
              className="inline-block bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Ver Productos
            </a>
            <a
              href="/contacto"
              className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 