import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase para uso en Server Components y API Routes.
 * Usa las variables de entorno del servidor.
 */
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
