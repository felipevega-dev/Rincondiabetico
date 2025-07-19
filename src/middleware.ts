import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { isAdmin } from '@/lib/auth'

// Rutas que requieren autenticación
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/pedidos(.*)',
  '/perfil(.*)',
  '/carrito(.*)',
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
    
    // Verificar si el usuario es admin
    const userIsAdmin = await isAdmin()
    
    if (!userIsAdmin) {
      // Redirigir a dashboard si no es admin
      return Response.redirect(new URL('/dashboard', req.url))
    }
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