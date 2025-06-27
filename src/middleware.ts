import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rutas que requieren autenticación
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/pedidos(.*)',
  '/perfil(.*)',
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
    await auth.protect({ role: 'admin' })
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