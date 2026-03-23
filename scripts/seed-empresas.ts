/**
 * Script para insertar 4 empresas de prueba con sus campañas en Supabase.
 * Uso: npx ts-node --esm scripts/seed-empresas.ts
 *
 * IMPORTANTE: usa el service_role para saltarse RLS.
 * NO ejecutar en producción con datos reales.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/** Genera un slug URL-safe */
function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Date.now().toString(36)
}

const EMPRESAS_DEMO = [
  {
    nombre: 'Pollo Campero Guatemala',
    sitio_web: 'https://campero.com',
    color_primario: '#E8000D',
    color_secundario: '#FFC72C',
    plan: 'pro',
    industria: 'restaurantes',
    campanas: [
      {
        nombre_campana: 'Sabor Ganador Junio',
        tipo: 'ruleta' as const,
        canales: ['whatsapp', 'instagram', 'landing'],
        estado: 'activa' as const,
        configuracion: {
          premios: [
            { nombre: '15% de descuento', probabilidad: 60 },
            { nombre: 'Pieza de Pollo Gratis', probabilidad: 30 },
            { nombre: 'Menú Completo Gratis', probabilidad: 10 },
          ],
          condicion: 'correo',
          frecuencia: '1_total',
          mensaje_bienvenida: '¡Gira la ruleta y gana premios increíbles de Pollo Campero! Solo necesitas tu correo.',
          horas_expiracion_codigo: 24,
          limite_participantes: null,
          color_primario: '#E8000D',
        },
      },
      {
        nombre_campana: 'Fan Club Campero',
        tipo: 'puntos' as const,
        canales: ['telegram', 'landing'],
        estado: 'activa' as const,
        configuracion: {
          puntos_por_monto: 1,
          monto_base: 15,
          meta_canje: 30,
          premio_canje: 'Combo Familiar Gratis',
          condicion: 'correo',
          frecuencia: 'sin_limite',
          mensaje_bienvenida: '¡Acumula puntos con cada visita a Pollo Campero y canjéalos por premios!',
          horas_expiracion_codigo: 72,
          color_primario: '#E8000D',
        },
      },
    ],
  },
  {
    nombre: 'Walmart Guatemala',
    sitio_web: 'https://walmart.com.gt',
    color_primario: '#0071CE',
    color_secundario: '#FFC72C',
    plan: 'enterprise',
    industria: 'retail',
    campanas: [
      {
        nombre_campana: 'Eco-Puntos Walmart',
        tipo: 'factura' as const,
        canales: ['telegram', 'whatsapp', 'landing'],
        estado: 'activa' as const,
        configuracion: {
          puntos_por_monto: 1,
          monto_base: 10,
          meta_canje: 50,
          premio_canje: '$5 de descuento en combustible Puma',
          condicion: 'telefono',
          frecuencia: 'sin_limite',
          mensaje_bienvenida: '¡Sube tu factura de Walmart y acumula Eco-Puntos canjeables en gasolineras!',
          horas_expiracion_codigo: 168,
          color_primario: '#0071CE',
        },
      },
    ],
  },
  {
    nombre: "McDonald's Guatemala",
    sitio_web: 'https://mcdonalds.com.gt',
    color_primario: '#FFC72C',
    color_secundario: '#DA291C',
    plan: 'pro',
    industria: 'restaurantes',
    campanas: [
      {
        nombre_campana: 'Cupones Flash McD',
        tipo: 'cupon' as const,
        canales: ['instagram', 'landing'],
        estado: 'activa' as const,
        configuracion: {
          premios: [{ nombre: 'Cuarto de Libra con queso', probabilidad: 100 }],
          condicion: 'correo',
          frecuencia: '1_total',
          mensaje_bienvenida: '¡Obtén tu Cuarto de Libra gratis! Solo por tiempo limitado. Código único por persona.',
          horas_expiracion_codigo: 72,
          limite_participantes: 5000,
          deep_link_url: 'https://mcdonalds.com/app',
          color_primario: '#FFC72C',
        },
      },
    ],
  },
  {
    nombre: 'Taquería Don Chema',
    sitio_web: '',
    color_primario: '#F97316',
    color_secundario: '#22C55E',
    plan: 'starter',
    industria: 'restaurantes',
    campanas: [
      {
        nombre_campana: 'Taco Feliz',
        tipo: 'ruleta' as const,
        canales: ['whatsapp', 'landing'],
        estado: 'activa' as const,
        configuracion: {
          premios: [
            { nombre: '2 tacos gratis', probabilidad: 25 },
            { nombre: '15% de descuento', probabilidad: 50 },
            { nombre: 'Orden de nachos gratis', probabilidad: 25 },
          ],
          condicion: 'correo',
          frecuencia: '1_dia',
          mensaje_bienvenida: '¡Bienvenido a Taquería Don Chema! Gira y gana tu premio de hoy.',
          horas_expiracion_codigo: 8,
          limite_participantes: null,
          color_primario: '#F97316',
        },
      },
    ],
  },
]

async function seedEmpresas() {
  console.log('🌱 Iniciando seed de empresas de prueba...\n')

  for (const datos of EMPRESAS_DEMO) {
    // Verificar si ya existe
    const { data: existe } = await supabase
      .from('empresas')
      .select('id, nombre')
      .eq('nombre', datos.nombre)
      .maybeSingle()

    let empresaId: string

    if (existe) {
      console.log(`⏭  Empresa ya existe: ${datos.nombre} (${existe.id})`)
      empresaId = existe.id
    } else {
      const { data: empresa, error } = await supabase
        .from('empresas')
        .insert({
          nombre: datos.nombre,
          sitio_web: datos.sitio_web || null,
          color_primario: datos.color_primario,
          color_secundario: datos.color_secundario,
          plan: datos.plan,
          industria: datos.industria,
          // Sin owner_id para las de prueba (se pueden asignar manualmente)
        })
        .select()
        .single()

      if (error || !empresa) {
        console.error(`❌ Error creando empresa ${datos.nombre}:`, error?.message)
        continue
      }

      empresaId = empresa.id
      console.log(`✅ Empresa creada: ${datos.nombre} (${empresaId})`)
    }

    // Crear campañas de la empresa
    for (const camp of datos.campanas) {
      const slug = slugify(camp.nombre_campana)

      const { error: errCamp } = await supabase
        .from('campanas')
        .insert({
          slug,
          nombre_negocio: datos.nombre,
          nombre_campana: camp.nombre_campana,
          tipo: camp.tipo,
          canales: camp.canales,
          estado: camp.estado,
          configuracion: camp.configuracion,
          // creado_por puede asignarse después si se vincula con un user real
        })

      if (errCamp) {
        console.error(`   ❌ Error creando campaña "${camp.nombre_campana}":`, errCamp.message)
      } else {
        console.log(`   ✅ Campaña creada: "${camp.nombre_campana}" → /c/${slug}`)
      }
    }
  }

  console.log('\n🏁 Seed completado.')
}

seedEmpresas().catch(console.error)
