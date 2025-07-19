import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rutas que requieren autenticación
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/pedidos(.*)',
  '/perfil(.*)',
  '/carrito(.*)',
  '/favoritos(.*)',
])

// Rutas solo para administradores
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Proteger rutas que requieren autenticación
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  
  // Proteger rutas de administrador
  if (isAdminRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      await auth.protect()
      return
    }
    
    // Para simplificar, permitimos todas las rutas admin autenticadas
    // La verificación específica de admin se hace en cada página
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 