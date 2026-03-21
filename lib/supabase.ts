'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente de Supabase para uso en el navegador (componentes cliente).
 * Usa las variables de entorno públicas de Next.js.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
