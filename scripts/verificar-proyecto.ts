import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

function ok(msg: string) { console.log(`  ✅ ${msg}`) }
function fail(msg: string) { console.log(`  ❌ ${msg}`) }

async function verificarProyecto() {
  console.log('\n🔍 Verificando FREEPOL — Checklist completo\n')

  // ─── 1. Variables de entorno ───────────────────────────────────────────────
  console.log('📋 Variables de entorno:')
  const varsRequeridas = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GROQ_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'HASH_SECRET',
    'NEXT_PUBLIC_APP_URL',
  ]
  const varsOpcionales = ['TELEGRAM_BOT_TOKEN', 'RESEND_API_KEY']

  varsRequeridas.forEach((v) => {
    if (process.env[v]) ok(v)
    else fail(`${v} (REQUERIDA — faltante)`)
  })
  varsOpcionales.forEach((v) => {
    const val = process.env[v]
    if (val && val !== 'tu_token_aqui' && val !== 'tu_resend_api_key_aqui') ok(`${v} (configurada)`)
    else console.log(`  ⚠️  ${v} (opcional — no configurada)`)
  })

  // ─── 2. Conexión Supabase ──────────────────────────────────────────────────
  console.log('\n🗄️  Supabase:')
  try {
    await supabase.from('campanas').select('id').limit(1)
    ok('Conexión exitosa')
  } catch {
    fail('No se pudo conectar a Supabase')
  }

  // ─── 3. Tablas existentes ──────────────────────────────────────────────────
  console.log('\n📦 Tablas en Supabase:')
  const tablas = [
    'campanas',
    'participantes',
    'codigos',
    'puntos_participantes',
    'empresas',
    'empresa_miembros',
    'campana_aliados',
    'telegram_usuarios',
    'notificaciones',
  ]

  for (const tabla of tablas) {
    try {
      const { error } = await supabase.from(tabla).select('id').limit(1)
      if (error) fail(`Tabla '${tabla}' — ${error.message}`)
      else ok(`Tabla '${tabla}' existe`)
    } catch (e) {
      fail(`Tabla '${tabla}' — error de conexión`)
    }
  }

  // ─── 4. Demos cargados ────────────────────────────────────────────────────
  console.log('\n🎪 Demos pre-cargados:')
  const demos = [
    { slug: 'sabor-ganador-campero', nombre: 'Pollo Campero' },
    { slug: 'eco-puntos-walmart-puma', nombre: 'Walmart + Puma' },
    { slug: 'cupones-flash-mcdonalds', nombre: "McDonald's" },
  ]

  for (const demo of demos) {
    try {
      const { data } = await supabase
        .from('campanas')
        .select('id, estado')
        .eq('slug', demo.slug)
        .maybeSingle()

      if (data) ok(`${demo.nombre} (${demo.slug}) — estado: ${data.estado}`)
      else fail(`${demo.nombre} (${demo.slug}) — NO encontrado. Correr: npm run seed`)
    } catch {
      fail(`${demo.nombre} — error al consultar`)
    }
  }

  // ─── 5. Redis ─────────────────────────────────────────────────────────────
  console.log('\n⚡ Upstash Redis:')
  try {
    await redis.set('freepol_test', 'ok', { ex: 10 })
    const val = await redis.get('freepol_test')
    if (val === 'ok') ok('Conexión y lectura/escritura exitosas')
    else fail('Escritura exitosa pero lectura falló')
  } catch (e) {
    fail(`No se pudo conectar a Redis: ${e}`)
  }

  // ─── Resumen ──────────────────────────────────────────────────────────────
  console.log('\n📋 Orden de ejecución para presentar:')
  console.log('  1. npm run seed      → cargar los 3 demos en Supabase')
  console.log('  2. npm run verificar → ejecutar este script')
  console.log('  3. npm run dev       → servidor Next.js en localhost:3000')
  console.log('  4. npm run bot       → bot de Telegram (terminal separada)')
  console.log('\n🌐 URLs para la demo:')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  console.log(`  Landing:     ${appUrl}`)
  console.log(`  Chat IA:     ${appUrl}/chat`)
  console.log(`  Wizard:      ${appUrl}/wizard`)
  console.log(`  Dashboard:   ${appUrl}/dashboard`)
  console.log(`  Demos:       ${appUrl}/demos`)
  console.log(`  Campero:     ${appUrl}/c/sabor-ganador-campero`)
  console.log(`  Walmart:     ${appUrl}/c/eco-puntos-walmart-puma`)
  console.log(`  McDonalds:   ${appUrl}/c/cupones-flash-mcdonalds`)
  console.log(`  Validar:     ${appUrl}/validar`)
  console.log('\n🚀 ¡Listo para presentar FREEPOL!\n')
}

verificarProyecto().then(() => process.exit(0)).catch((e) => {
  console.error('Error en verificación:', e)
  process.exit(1)
})
