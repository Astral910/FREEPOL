/**
 * Crea 4 usuarios de autenticación (auth.users), empresas, empresa_miembros
 * y una campaña activa por usuario — todo enlazado con creado_por / owner_id.
 *
 * Requisitos en .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (JWT del panel Supabase → Settings → API, NO la URL postgres)
 *
 * Opcional:
 * - SEED_DEMO_USER_PASSWORD — si no existe, usa la contraseña por defecto solo para demos locales.
 *
 * Uso: npm run seed:usuarios-demo
 *
 * IMPORTANTE: solo para entornos de prueba. Cambia las contraseñas en producción.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import type { ConfigCampana } from '../types/campana'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Contraseña compartida para las 4 cuentas demo (sobrescribible por env) */
const DEMO_PASSWORD =
  process.env.SEED_DEMO_USER_PASSWORD ?? 'FreepolDemo2026!'

const supabase = createClient(url!, serviceKey!, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function slugify(nombre: string): string {
  return (
    nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) +
    '-' +
    Date.now().toString(36)
  )
}

function baseConfig(partial: Partial<ConfigCampana> & Pick<ConfigCampana, 'nombre_negocio' | 'nombre_campana' | 'tipo' | 'canal' | 'condicion' | 'premios' | 'mensaje_bienvenida' | 'horas_expiracion_codigo'>): ConfigCampana {
  const now = new Date()
  const fin = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
  return {
    nombre_negocio: partial.nombre_negocio,
    nombre_campana: partial.nombre_campana,
    tipo: partial.tipo,
    canal: partial.canal,
    condicion: partial.condicion,
    premios: partial.premios,
    puntos_por_monto: partial.puntos_por_monto ?? null,
    monto_base: partial.monto_base ?? null,
    meta_canje: partial.meta_canje ?? null,
    frecuencia: partial.frecuencia ?? '1_total',
    fecha_inicio: partial.fecha_inicio ?? now.toISOString().slice(0, 10),
    fecha_fin: partial.fecha_fin ?? fin.toISOString().slice(0, 10),
    horario_inicio: partial.horario_inicio ?? null,
    horario_fin: partial.horario_fin ?? null,
    dias_activos: partial.dias_activos ?? null,
    mensaje_bienvenida: partial.mensaje_bienvenida,
    limite_participantes: partial.limite_participantes ?? null,
    deep_link_url: partial.deep_link_url ?? null,
    horas_expiracion_codigo: partial.horas_expiracion_codigo,
  }
}

const CUENTAS: Array<{
  email: string
  nombreUsuario: string
  empresa: {
    nombre: string
    sitio_web: string
    color_primario: string
    color_secundario: string
    plan: string
    industria: string
  }
  campana: {
    nombre_campana: string
    tipo: ConfigCampana['tipo']
    canales: string[]
    config: ConfigCampana
  }
}> = [
  {
    email: 'demo.pollo@freepol-demo.local',
    nombreUsuario: 'Demo Pollo',
    empresa: {
      nombre: 'FREEPOL Demo — Pollo',
      sitio_web: 'https://freepol.app',
      color_primario: '#E8000D',
      color_secundario: '#FFC72C',
      plan: 'pro',
      industria: 'restaurantes',
    },
    campana: {
      nombre_campana: 'Ruleta Sabor Demo',
      tipo: 'ruleta',
      canales: ['whatsapp', 'landing'],
      config: baseConfig({
        nombre_negocio: 'FREEPOL Demo — Pollo',
        nombre_campana: 'Ruleta Sabor Demo',
        tipo: 'ruleta',
        canal: 'whatsapp',
        condicion: 'correo',
        premios: [
          { nombre: '15% descuento', probabilidad: 60 },
          { nombre: 'Pieza gratis', probabilidad: 30 },
          { nombre: 'Menú gratis', probabilidad: 10 },
        ],
        mensaje_bienvenida: '¡Gira la ruleta demo de FREEPOL! Valida tu correo.',
        horas_expiracion_codigo: 48,
        frecuencia: '1_total',
      }),
    },
  },
  {
    email: 'demo.retail@freepol-demo.local',
    nombreUsuario: 'Demo Retail',
    empresa: {
      nombre: 'FREEPOL Demo — Retail',
      sitio_web: 'https://freepol.app',
      color_primario: '#0071CE',
      color_secundario: '#22C55E',
      plan: 'starter',
      industria: 'retail',
    },
    campana: {
      nombre_campana: 'Puntos Compra Demo',
      tipo: 'puntos',
      canales: ['telegram', 'landing'],
      config: baseConfig({
        nombre_negocio: 'FREEPOL Demo — Retail',
        nombre_campana: 'Puntos Compra Demo',
        tipo: 'puntos',
        canal: 'telegram',
        condicion: 'correo',
        premios: [{ nombre: '$10 de descuento', probabilidad: 100 }],
        puntos_por_monto: 1,
        monto_base: 25,
        meta_canje: 40,
        mensaje_bienvenida: 'Acumula puntos por cada compra (demo FREEPOL).',
        horas_expiracion_codigo: 72,
        frecuencia: 'sin_limite',
      }),
    },
  },
  {
    email: 'demo.cupon@freepol-demo.local',
    nombreUsuario: 'Demo Cupón',
    empresa: {
      nombre: 'FREEPOL Demo — Café',
      sitio_web: 'https://freepol.app',
      color_primario: '#E8344E',
      color_secundario: '#F2839A',
      plan: 'free',
      industria: 'restaurantes',
    },
    campana: {
      nombre_campana: 'Cupón Bienvenida Demo',
      tipo: 'cupon',
      canales: ['instagram', 'landing'],
      config: baseConfig({
        nombre_negocio: 'FREEPOL Demo — Café',
        nombre_campana: 'Cupón Bienvenida Demo',
        tipo: 'cupon',
        canal: 'instagram',
        condicion: 'correo',
        premios: [{ nombre: '20% en tu próxima visita', probabilidad: 100 }],
        mensaje_bienvenida: 'Tu cupón único demo FREEPOL te espera.',
        horas_expiracion_codigo: 24,
        deep_link_url: 'https://freepol.app',
        frecuencia: '1_total',
      }),
    },
  },
  {
    email: 'demo.factura@freepol-demo.local',
    nombreUsuario: 'Demo Factura',
    empresa: {
      nombre: 'FREEPOL Demo — Combustible',
      sitio_web: 'https://freepol.app',
      color_primario: '#0A0A0A',
      color_secundario: '#22C55E',
      plan: 'enterprise',
      industria: 'gasolineras',
    },
    campana: {
      nombre_campana: 'Eco Puntos Factura Demo',
      tipo: 'factura',
      canales: ['whatsapp', 'telegram', 'landing'],
      config: baseConfig({
        nombre_negocio: 'FREEPOL Demo — Combustible',
        nombre_campana: 'Eco Puntos Factura Demo',
        tipo: 'factura',
        canal: 'todos',
        condicion: 'telefono',
        premios: [{ nombre: '$5 descuento en combustible', probabilidad: 100 }],
        puntos_por_monto: 1,
        monto_base: 10,
        meta_canje: 50,
        mensaje_bienvenida: 'Sube tu factura y suma puntos (demo FREEPOL).',
        horas_expiracion_codigo: 168,
        frecuencia: 'sin_limite',
      }),
    },
  },
]

async function obtenerUsuarioPorEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (error) {
    console.error('listUsers:', error.message)
    return null
  }
  const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase())
  return u?.id ?? null
}

async function crearObtenerUsuario(email: string, password: string, fullName: string): Promise<string> {
  const existente = await obtenerUsuarioPorEmail(email)
  if (existente) {
    console.log(`   ↪ Usuario ya existe: ${email}`)
    return existente
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })
  if (error) {
    throw new Error(`createUser ${email}: ${error.message}`)
  }
  if (!data.user?.id) throw new Error(`createUser ${email}: sin id`)
  console.log(`   ✓ Usuario creado: ${email}`)
  return data.user.id
}

async function asegurarEmpresa(userId: string, emp: (typeof CUENTAS)[0]['empresa']): Promise<string> {
  const { data: ya } = await supabase
    .from('empresas')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle()
  if (ya?.id) {
    console.log(`   ↪ Empresa ya existe para owner ${userId.slice(0, 8)}…`)
    return ya.id
  }
  const { data, error } = await supabase
    .from('empresas')
    .insert({
      nombre: emp.nombre,
      sitio_web: emp.sitio_web,
      color_primario: emp.color_primario,
      color_secundario: emp.color_secundario,
      plan: emp.plan,
      industria: emp.industria,
      owner_id: userId,
    })
    .select('id')
    .single()
  if (error) throw new Error(`empresas insert: ${error.message}`)
  console.log(`   ✓ Empresa creada: ${emp.nombre}`)
  return data.id
}

async function asegurarMiembro(empresaId: string, userId: string) {
  const { data: ya } = await supabase
    .from('empresa_miembros')
    .select('id')
    .eq('empresa_id', empresaId)
    .eq('user_id', userId)
    .maybeSingle()
  if (ya) return
  const { error } = await supabase.from('empresa_miembros').insert({
    empresa_id: empresaId,
    user_id: userId,
    rol: 'admin',
  })
  if (error) throw new Error(`empresa_miembros: ${error.message}`)
  console.log(`   ✓ Miembro admin vinculado`)
}

async function asegurarCampana(
  userId: string,
  nombreNegocio: string,
  item: (typeof CUENTAS)[0]['campana'],
) {
  const { data: dup } = await supabase
    .from('campanas')
    .select('id, slug')
    .eq('creado_por', userId)
    .eq('nombre_campana', item.nombre_campana)
    .maybeSingle()
  if (dup) {
    console.log(`   ↪ Campaña ya existe: /c/${dup.slug}`)
    return dup.slug
  }
  const slug = slugify(item.nombre_campana)
  const { error } = await supabase.from('campanas').insert({
    slug,
    nombre_negocio: nombreNegocio,
    nombre_campana: item.nombre_campana,
    tipo: item.tipo,
    canales: item.canales,
    estado: 'activa',
    configuracion: item.config,
    creado_por: userId,
  })
  if (error) throw new Error(`campanas: ${error.message}`)
  console.log(`   ✓ Campaña activa: /c/${slug}`)
  return slug
}

async function main() {
  if (!url || !serviceKey) {
    console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
    process.exit(1)
  }
  if (serviceKey.startsWith('postgres')) {
    console.error(
      '❌ SUPABASE_SERVICE_ROLE_KEY debe ser el JWT (eyJ…) de Supabase → Settings → API, no la URL de Postgres.',
    )
    process.exit(1)
  }

  console.log('\n🌱 FREEPOL — seed usuarios demo + empresas + campañas\n')
  const resultados: Array<{ email: string; password: string; slug: string }> = []

  for (const cuenta of CUENTAS) {
    console.log(`\n▸ ${cuenta.email}`)
    const userId = await crearObtenerUsuario(cuenta.email, DEMO_PASSWORD, cuenta.nombreUsuario)
    const empresaId = await asegurarEmpresa(userId, cuenta.empresa)
    await asegurarMiembro(empresaId, userId)
    const slug = await asegurarCampana(userId, cuenta.empresa.nombre, cuenta.campana)
    resultados.push({ email: cuenta.email, password: DEMO_PASSWORD, slug })
  }

  const appBase = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  console.log('\n' + '='.repeat(72))
  console.log('✅ LISTO — Usa estas cuentas en Iniciar sesión (misma contraseña si no usaste env):')
  console.log('='.repeat(72))
  console.log(`\nContraseña: ${DEMO_PASSWORD}\n`)
  for (const r of resultados) {
    console.log(`  • ${r.email}`)
    console.log(`    Landing: ${appBase}/c/${r.slug}`)
  }
  console.log('\n' + '='.repeat(72))
  console.log(
    'Seguridad: en producción cambia contraseñas o borra estos usuarios en Supabase → Authentication.',
  )
  console.log('Opcional: define SEED_DEMO_USER_PASSWORD en .env.local para otra clave.\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
