export const clerkConfig = {
  // Rutas públicas
  publicRoutes: [
    '/',
    '/productos(.*)',
    '/sobre-nosotros',
    '/contacto',
    '/api/webhooks(.*)',
    '/api/products(.*)',
    '/api/categories(.*)',
    '/api/banners(.*)',
    '/api/pages(.*)',
    '/api/store-settings(.*)',
  ],
  
  // Rutas de autenticación
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  
  // Ruta después de iniciar sesión
  afterSignInUrl: '/cuenta',
  afterSignUpUrl: '/cuenta',
  
  // Ruta de perfil
  profileUrl: '/perfil',
} 