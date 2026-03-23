import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

/**
 * Cliente de Supabase para uso en Server Components y API Routes.
 * Maneja correctamente las cookies de Next.js App Router.
 *
 * NOTA: Para API Routes (route.ts) usar createServerClient() de abajo.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // En Server Components el set no está disponible — ignorar
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options)
          } catch {
            // En Server Components el set no está disponible — ignorar
          }
        },
      },
    },
  )
}

/**
 * Cliente simple sin manejo de cookies.
 * Usar en API Routes (route.ts) donde next/headers no es necesario.
 */
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
