import { createClient } from '@/lib/supabase'
import { getEmpresaDelUsuario, type Empresa } from '@/lib/empresa'
import type { User } from '@supabase/supabase-js'

/**
 * Obtiene el usuario actualmente autenticado.
 * Devuelve null si no hay sesión.
 */
export async function getUsuarioActual(): Promise<User | null> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

/**
 * Obtiene el usuario con su empresa asociada en una sola llamada.
 * Útil para pages que necesitan ambos datos al montar.
 * Devuelve null si no hay sesión activa.
 */
export async function getUsuarioConEmpresa(): Promise<{
  usuario: User
  empresa: Empresa | null
} | null> {
  const usuario = await getUsuarioActual()
  if (!usuario) return null

  const empresa = await getEmpresaDelUsuario(usuario.id)
  return { usuario, empresa }
}
