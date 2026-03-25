import { createClient } from '@/lib/supabase'
import { BRAND_PRIMARY, BRAND_SUCCESS } from '@/lib/brand'

export interface Empresa {
  id: string
  nombre: string
  sitio_web?: string
  color_primario: string
  color_secundario: string
  logo_url?: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  owner_id: string
  industria?: string
  creado_en: string
}

/**
 * Busca la empresa del usuario a través de la tabla empresa_miembros.
 * Un usuario puede ser miembro de una empresa con cualquier rol.
 */
export async function getEmpresaDelUsuario(userId: string): Promise<Empresa | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('empresa_miembros')
    .select('empresa_id, empresas(*)')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  return (data.empresas as unknown as Empresa) ?? null
}

/**
 * Crea una nueva empresa y agrega al usuario como admin.
 * Se llama al completar el onboarding por primera vez.
 */
export async function crearEmpresa(
  userId: string,
  datos: {
    nombre: string
    sitio_web?: string
    industria?: string
    plan?: string
  },
): Promise<Empresa> {
  const supabase = createClient()

  const { data: empresa, error: errEmpresa } = await supabase
    .from('empresas')
    .insert({
      nombre: datos.nombre,
      sitio_web: datos.sitio_web ?? null,
      color_primario: BRAND_PRIMARY,
      color_secundario: BRAND_SUCCESS,
      industria: datos.industria ?? 'otro',
      plan: datos.plan ?? 'free',
      owner_id: userId,
    })
    .select()
    .single()

  if (errEmpresa || !empresa) {
    throw new Error(`Error al crear empresa: ${errEmpresa?.message}`)
  }

  // Registrar al owner como admin en empresa_miembros
  await supabase.from('empresa_miembros').insert({
    empresa_id: empresa.id,
    user_id: userId,
    rol: 'admin',
  })

  return empresa as Empresa
}

/**
 * Actualiza los datos de una empresa.
 * Solo el owner puede actualizar (garantizado por RLS).
 */
export async function actualizarEmpresa(
  empresaId: string,
  datos: Partial<Omit<Empresa, 'id' | 'owner_id' | 'creado_en'>>,
): Promise<Empresa> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('empresas')
    .update({ ...datos, actualizado_en: new Date().toISOString() })
    .eq('id', empresaId)
    .select()
    .single()

  if (error || !data) {
    throw new Error(`Error al actualizar empresa: ${error?.message}`)
  }

  return data as Empresa
}
