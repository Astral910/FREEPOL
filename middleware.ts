import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Rutas que requieren sesión activa.
 * Cualquier ruta que empiece con estos prefijos queda protegida.
 */
const RUTAS_PROTEGIDAS = ['/dashboard', '/onboarding']

/**
 * Middleware de Next.js — protege rutas y refresca sesión automáticamente.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  // Refrescar sesión (mantiene el token actualizado automáticamente)
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Verificar si la ruta actual está protegida
  const esRutaProtegida = RUTAS_PROTEGIDAS.some((ruta) => pathname.startsWith(ruta))

  if (esRutaProtegida && !session) {
    // Redirigir al inicio con parámetro para abrir el AuthDialog
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('auth', 'required')
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // Aplica a todas las rutas excepto archivos estáticos
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
}
