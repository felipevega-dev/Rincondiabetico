import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-600">🧁 Rincón Diabético</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <button className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Registrarse
                  </button>
                </SignUpButton>
              </SignedOut>
              
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Deliciosos Postres Artesanales
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            En Chiguayante, Chile - Solo retiro en tienda
          </p>
          
          <div className="mt-8">
            <SignedOut>
              <p className="text-gray-600 mb-6">
                Regístrate para ver nuestro catálogo y hacer pedidos
              </p>
              <SignUpButton>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-semibold">
                  Comenzar a Comprar
                </button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">🍰 Tortas</h3>
                  <p className="text-gray-600">Tortas personalizadas para toda ocasión</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">🧁 Cupcakes</h3>
                  <p className="text-gray-600">Deliciosos cupcakes con decoraciones únicas</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">🍪 Dulces</h3>
                  <p className="text-gray-600">Variedad de dulces y postres artesanales</p>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </main>
    </div>
  );
}
