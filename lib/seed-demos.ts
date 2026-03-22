import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Cargar .env.local para ejecución standalone
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const AHORA = new Date().toISOString()
const EN_30_DIAS = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
const EN_60_DIAS = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
const EN_15_DIAS = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()

const DEMOS = [
  {
    slug: 'sabor-ganador-campero',
    nombre_negocio: 'Pollo Campero',
    nombre_campana: 'Sabor Ganador',
    tipo: 'ruleta',
    canales: ['whatsapp', 'instagram', 'landing'],
    estado: 'activa',
    configuracion: {
      premios: [
        { nombre: '15% de descuento', probabilidad: 60 },
        { nombre: 'Pieza de Pollo Gratis', probabilidad: 30 },
        { nombre: 'Menú Completo Gratis', probabilidad: 10 },
      ],
      condicion: 'correo',
      frecuencia: '1_total',
      fecha_inicio: AHORA,
      fecha_fin: EN_30_DIAS,
      mensaje_bienvenida: '¡Gira la ruleta y gana premios increíbles de Pollo Campero! Solo necesitas tu correo.',
      horas_expiracion_codigo: 24,
      limite_participantes: null,
      color_primario: '#E8000D',
    },
  },
  {
    slug: 'eco-puntos-walmart-puma',
    nombre_negocio: 'Walmart + Grupo Puma',
    nombre_campana: 'Eco-Puntos',
    tipo: 'factura',
    canales: ['telegram', 'whatsapp', 'landing'],
    estado: 'activa',
    configuracion: {
      puntos_por_monto: 1,
      monto_base: 10,
      meta_canje: 50,
      premios: [{ nombre: '$5 de descuento en combustible Puma', probabilidad: 100 }],
      condicion: 'telefono',
      frecuencia: 'sin_limite',
      fecha_inicio: AHORA,
      fecha_fin: EN_60_DIAS,
      mensaje_bienvenida: '¡Sube tu factura de Walmart y acumula Eco-Puntos canjeables en combustible!',
      horas_expiracion_codigo: 168,
      color_primario: '#0071CE',
    },
  },
  {
    slug: 'cupones-flash-mcdonalds',
    nombre_negocio: "McDonald's Guatemala",
    nombre_campana: 'Cupones Flash',
    tipo: 'cupon',
    canales: ['instagram', 'landing'],
    estado: 'activa',
    configuracion: {
      premios: [{ nombre: 'Cuarto de Libra con queso', probabilidad: 100 }],
      condicion: 'correo',
      frecuencia: '1_total',
      fecha_inicio: AHORA,
      fecha_fin: EN_15_DIAS,
      mensaje_bienvenida: '¡Obtén tu Cuarto de Libra gratis! Solo por tiempo limitado. Código único por persona.',
      horas_expiracion_codigo: 72,
      limite_participantes: 5000,
      deep_link_url: 'https://mcdonalds.com/app',
      color_primario: '#FFC72C',
    },
  },
]

/**
 * Inserta los 3 demos de FREEPOL en Supabase si no existen aún.
 * Ejecutar con: npx ts-node --esm lib/seed-demos.ts
 */
async function seedDemos() {
  console.log('🌱 Iniciando seed de demos...\n')

  for (const demo of DEMOS) {
    const { data: existente } = await supabase
      .from('campanas')
      .select('id')
      .eq('slug', demo.slug)
      .maybeSingle()

    if (existente) {
      console.log(`⏭️  Demo ya existe: ${demo.slug}`)
      continue
    }

    const { data, error } = await supabase
      .from('campanas')
      .insert(demo)
      .select('id, slug')
      .single()

    if (error) {
      console.error(`❌ Error al insertar ${demo.slug}:`, error.message)
    } else {
      console.log(`✅ Demo creado: ${demo.slug} (id: ${data.id})`)
    }
  }

  console.log('\n🎉 Seed de demos completado.')
  console.log('Páginas disponibles:')
  DEMOS.forEach((d) => console.log(`  • /c/${d.slug}`))
}

seedDemos().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
