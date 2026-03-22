import TelegramBot from 'node-telegram-bot-api'
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as QRCode from 'qrcode'
import { generarCodigoUnico, generarHash, calcularExpiracion } from '../lib/codigos'

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN no configurado en .env.local')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://freepol.app'

// Inicializar bot en modo polling (solo para desarrollo)
const bot = new TelegramBot(BOT_TOKEN, { polling: true })

console.log('🤖 Bot FREEPOL iniciado en modo polling...')

/**
 * Guarda o actualiza el usuario de Telegram en la BD.
 */
async function upsertTelegramUsuario(msg: TelegramBot.Message) {
  const { from } = msg
  if (!from) return null

  const { data: existente } = await supabase
    .from('telegram_usuarios')
    .select('id, participante_id, campana_id')
    .eq('telegram_id', String(from.id))
    .maybeSingle()

  if (existente) {
    await supabase
      .from('telegram_usuarios')
      .update({ ultimo_mensaje: new Date().toISOString() })
      .eq('telegram_id', String(from.id))
    return existente
  }

  const { data } = await supabase
    .from('telegram_usuarios')
    .insert({
      telegram_id: String(from.id),
      username: from.username ?? null,
      nombre: `${from.first_name ?? ''} ${from.last_name ?? ''}`.trim(),
    })
    .select()
    .single()

  return data
}

/**
 * Obtiene las campañas activas ordenadas por fecha.
 */
async function getCampanasActivas() {
  const { data } = await supabase
    .from('campanas')
    .select('id, slug, nombre_campana, nombre_negocio, tipo, configuracion')
    .eq('estado', 'activa')
    .order('creado_en', { ascending: false })
    .limit(5)
  return data ?? []
}

// ─── /start ────────────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  try {
    await upsertTelegramUsuario(msg)
    const campanas = await getCampanasActivas()

    if (campanas.length === 0) {
      await bot.sendMessage(chatId,
        '👋 Bienvenido a *FREEPOL*\n\nNo hay campañas activas en este momento\\.\nTe avisaremos cuando haya una nueva\\. 🔔',
        { parse_mode: 'MarkdownV2' },
      )
      return
    }

    const lista = campanas.map((c, i) => `${i + 1}\\. *${c.nombre_campana}* — ${c.nombre_negocio}`).join('\n')

    await bot.sendMessage(chatId,
      `👋 Bienvenido a *FREEPOL*\n\nSoy tu asistente de campañas de fidelización\\.\n\n📋 *Campañas activas ahora:*\n${lista}\n\nEscribe el número de la campaña para participar, o usa estos comandos:\n/puntos — Ver tu saldo de puntos\n/canjear — Canjear tus puntos\n/campanas — Ver todas las campañas\n/ayuda — Ver todos los comandos`,
      { parse_mode: 'MarkdownV2' },
    )
  } catch (e) {
    console.error('[/start]', e)
    await bot.sendMessage(chatId, 'Hubo un error. Intenta de nuevo en unos momentos. 🙏')
  }
})

// ─── /campanas ─────────────────────────────────────────────────────────────
bot.onText(/\/campanas/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const campanas = await getCampanasActivas()

    if (campanas.length === 0) {
      await bot.sendMessage(chatId, '📋 No hay campañas activas en este momento.')
      return
    }

    await bot.sendMessage(chatId, '📋 *Campañas disponibles:*\nSelecciona una para participar 👇', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: campanas.map((c) => [{
          text: `${c.nombre_campana} — ${c.nombre_negocio}`,
          callback_data: `participar_${c.id}`,
        }]),
      },
    })
  } catch (e) {
    console.error('[/campanas]', e)
    await bot.sendMessage(chatId, 'Hubo un error al cargar las campañas. 🙏')
  }
})

// ─── Callback: participar_[campana_id] ─────────────────────────────────────
bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id
  if (!chatId || !query.data?.startsWith('participar_')) return

  const campanaId = query.data.replace('participar_', '')
  const telegramId = String(query.from.id)

  try {
    await bot.answerCallbackQuery(query.id)

    // Verificar si ya participó en esta campaña
    const yaParticipo = await redis.exists(`tg:${campanaId}:${telegramId}`)
    if (yaParticipo) {
      await bot.sendMessage(chatId, '✅ Ya estás participando en esta campaña.\nEscribe /puntos para ver tu saldo.')
      return
    }

    const { data: campana } = await supabase
      .from('campanas')
      .select('*')
      .eq('id', campanaId)
      .single()

    if (!campana) {
      await bot.sendMessage(chatId, '❌ Campaña no encontrada.')
      return
    }

    // Registrar participante con telegram_id
    const { data: participante, error: errPart } = await supabase
      .from('participantes')
      .insert({ campana_id: campanaId, telegram_id: telegramId })
      .select('id')
      .single()

    if (errPart || !participante) {
      await bot.sendMessage(chatId, '❌ Error al registrarte. Intenta de nuevo.')
      return
    }

    // Guardar en Redis y actualizar telegram_usuarios
    await redis.set(`tg:${campanaId}:${telegramId}`, 'true', { ex: 30 * 24 * 60 * 60 })
    await supabase
      .from('telegram_usuarios')
      .update({ campana_id: campanaId, participante_id: participante.id })
      .eq('telegram_id', telegramId)

    // Incrementar participantes
    await supabase
      .from('campanas')
      .update({ total_participantes: (campana.total_participantes ?? 0) + 1 })
      .eq('id', campanaId)

    const url = `${APP_URL}/c/${campana.slug}`
    const tipo = campana.tipo

    if (tipo === 'ruleta') {
      await bot.sendMessage(chatId,
        `🎰 *${campana.nombre_campana}* de ${campana.nombre_negocio}\n\n¡Estás registrado! Visita este link para girar la ruleta y ganar tu premio:\n${url}\n\nToca el botón para ir directo 👇`,
        {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [[{ text: '🎰 Girar ruleta', url }]] },
        },
      )
    } else if (tipo === 'puntos' || tipo === 'factura') {
      const cfg = campana.configuracion ?? {}
      await bot.sendMessage(chatId,
        `⭐ *${campana.nombre_campana}* de ${campana.nombre_negocio}\n\n¡Registrado! Por cada $${cfg.monto_base ?? 10} de compra ganas ${cfg.puntos_por_monto ?? 1} punto(s).\n\n📸 *Para acumular puntos:*\nEnvíame una foto de tu factura y la proceso automáticamente.\n\n🎯 Meta: ${cfg.meta_canje ?? 50} puntos = ${cfg.premios?.[0]?.nombre ?? 'Premio'}`,
        { parse_mode: 'Markdown' },
      )
    } else {
      await bot.sendMessage(chatId,
        `🎟️ *${campana.nombre_campana}* de ${campana.nombre_negocio}\n\n¡Tu cupón está listo! Visita:\n${url}\n\nToca el botón para obtener tu código 👇`,
        {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [[{ text: '🎟️ Obtener cupón', url }]] },
        },
      )
    }
  } catch (e) {
    console.error('[callback participar]', e)
    if (chatId) await bot.sendMessage(chatId, 'Hubo un error procesando tu solicitud. 🙏')
  }
})

// ─── /puntos ───────────────────────────────────────────────────────────────
bot.onText(/\/puntos/, async (msg) => {
  const chatId = msg.chat.id
  const telegramId = String(msg.from?.id)

  try {
    const { data: tgUser } = await supabase
      .from('telegram_usuarios')
      .select('participante_id, campana_id')
      .eq('telegram_id', telegramId)
      .maybeSingle()

    if (!tgUser?.participante_id || !tgUser?.campana_id) {
      await bot.sendMessage(chatId, 'No estás registrado en ninguna campaña.\nEscribe /campanas para ver las disponibles.')
      return
    }

    const { data: puntos } = await supabase
      .from('puntos_participantes')
      .select('total_puntos')
      .eq('participante_id', tgUser.participante_id)
      .eq('campana_id', tgUser.campana_id)
      .maybeSingle()

    const { data: campana } = await supabase
      .from('campanas')
      .select('nombre_campana, configuracion')
      .eq('id', tgUser.campana_id)
      .single()

    const total = puntos?.total_puntos ?? 0
    const meta = campana?.configuracion?.meta_canje ?? 50

    await bot.sendMessage(chatId,
      `⭐ *Tu saldo de puntos*\n\n📊 ${campana?.nombre_campana ?? 'Campaña'}: *${total} puntos*\n🎯 Meta: ${meta} puntos\n📈 Te faltan: ${Math.max(0, meta - total)} puntos\n\nSigue comprando y enviando tus facturas 💪`,
      { parse_mode: 'Markdown' },
    )
  } catch (e) {
    console.error('[/puntos]', e)
    await bot.sendMessage(chatId, 'Hubo un error. Intenta de nuevo. 🙏')
  }
})

// ─── /canjear ──────────────────────────────────────────────────────────────
bot.onText(/\/canjear/, async (msg) => {
  const chatId = msg.chat.id
  const telegramId = String(msg.from?.id)

  try {
    const { data: tgUser } = await supabase
      .from('telegram_usuarios')
      .select('participante_id, campana_id')
      .eq('telegram_id', telegramId)
      .maybeSingle()

    if (!tgUser?.participante_id || !tgUser?.campana_id) {
      await bot.sendMessage(chatId, 'No estás registrado en ninguna campaña.\nEscribe /campanas primero.')
      return
    }

    const { data: puntos } = await supabase
      .from('puntos_participantes')
      .select('id, total_puntos')
      .eq('participante_id', tgUser.participante_id)
      .eq('campana_id', tgUser.campana_id)
      .maybeSingle()

    const { data: campana } = await supabase
      .from('campanas')
      .select('nombre_negocio, nombre_campana, configuracion')
      .eq('id', tgUser.campana_id)
      .single()

    const total = puntos?.total_puntos ?? 0
    const meta = campana?.configuracion?.meta_canje ?? 50

    if (total < meta) {
      await bot.sendMessage(chatId,
        `⚠️ Aún no tienes suficientes puntos.\n\n📊 Tienes: *${total} puntos*\n🎯 Necesitas: *${meta} puntos*\n📈 Te faltan: *${meta - total} puntos*\n\nEnvía más facturas para completar tu meta 💪`,
        { parse_mode: 'Markdown' },
      )
      return
    }

    const cfg = campana?.configuracion ?? {}
    const premio = cfg.premios?.[0]?.nombre ?? 'Premio especial'
    const prefijo = (campana?.nombre_negocio ?? 'FRPL').replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase()

    const codigo = generarCodigoUnico(prefijo)
    const hash = generarHash(codigo)
    const expira_en = calcularExpiracion(cfg.horas_expiracion_codigo ?? 48)

    await supabase.from('codigos').insert({
      participante_id: tgUser.participante_id,
      campana_id: tgUser.campana_id,
      codigo,
      hash_verificacion: hash,
      premio,
      expira_en: expira_en.toISOString(),
    })

    // Restar puntos
    if (puntos?.id) {
      await supabase
        .from('puntos_participantes')
        .update({ total_puntos: total - meta })
        .eq('id', puntos.id)
    }

    // Generar imagen QR
    const qrBuffer = await QRCode.toBuffer(codigo, { type: 'png', width: 300, margin: 2 })

    await bot.sendPhoto(chatId, qrBuffer, {
      caption: `🎉 *¡Premio canjeado!*\n\nTu código: \`${codigo}\`\nPremio: ${premio}\nVálido hasta: ${expira_en.toLocaleDateString('es-GT')}\n\nMuestra este QR en caja 🏪`,
      parse_mode: 'Markdown',
    })
  } catch (e) {
    console.error('[/canjear]', e)
    await bot.sendMessage(chatId, 'Hubo un error al procesar el canje. 🙏')
  }
})

// ─── Fotos (procesamiento de factura) ──────────────────────────────────────
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id
  const telegramId = String(msg.from?.id)

  try {
    const { data: tgUser } = await supabase
      .from('telegram_usuarios')
      .select('participante_id, campana_id')
      .eq('telegram_id', telegramId)
      .maybeSingle()

    if (!tgUser?.participante_id || !tgUser?.campana_id) {
      await bot.sendMessage(chatId, 'Primero regístrate en una campaña. Escribe /campanas.')
      return
    }

    const { data: campana } = await supabase
      .from('campanas')
      .select('id, nombre_campana, nombre_negocio, tipo, configuracion')
      .eq('id', tgUser.campana_id)
      .single()

    if (!campana || (campana.tipo !== 'factura' && campana.tipo !== 'puntos')) {
      await bot.sendMessage(chatId, 'Esta campaña no requiere fotos de facturas.')
      return
    }

    await bot.sendMessage(chatId, '📸 Procesando tu factura...\n\nEsto puede tardar unos segundos ⏳')

    // Descargar la foto más grande
    const fotos = msg.photo ?? []
    const fotoMasGrande = fotos[fotos.length - 1]
    const fileInfo = await bot.getFile(fotoMasGrande.file_id)

    if (!fileInfo.file_path) {
      await bot.sendMessage(chatId, '❌ No se pudo descargar la imagen.')
      return
    }

    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`
    const res = await fetch(fileUrl)
    const buffer = Buffer.from(await res.arrayBuffer())

    // Procesar con OCR
    const { procesarFacturaConOCR } = await import('../lib/ocr')
    const resultado = await procesarFacturaConOCR(buffer, campana, tgUser.participante_id)

    if (!resultado.exitoso) {
      await bot.sendMessage(chatId, `❌ ${resultado.razon_error ?? 'No se pudo procesar la factura'}`)
      return
    }

    const meta = campana.configuracion?.meta_canje ?? 50
    const falta = Math.max(0, meta - (resultado.nuevo_total ?? 0))

    let mensaje = `✅ *Factura procesada*\n\n💰 Monto detectado: $${resultado.monto_total}\n⭐ Puntos ganados: ${resultado.puntos_ganados}\n📊 Nuevo saldo: ${resultado.nuevo_total} puntos\n🎯 ${falta > 0 ? `Te faltan ${falta} puntos para canjear` : '¡Alcanzaste la meta!'}\n\n¡Sigue comprando! 💪`

    if (resultado.alcanzaste_meta) {
      await bot.sendMessage(chatId, mensaje, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🎁 Canjear ahora', callback_data: 'cmd_canjear' }]] },
      })
    } else {
      await bot.sendMessage(chatId, mensaje, { parse_mode: 'Markdown' })
    }
  } catch (e) {
    console.error('[photo]', e)
    await bot.sendMessage(chatId, 'Error al procesar la imagen. Intenta con una foto más clara. 🙏')
  }
})

// Callback para canjear desde botón inline
bot.on('callback_query', async (query) => {
  if (query.data !== 'cmd_canjear') return
  if (query.message?.chat.id) {
    await bot.sendMessage(query.message.chat.id, '/canjear')
  }
})

// ─── /ayuda ────────────────────────────────────────────────────────────────
bot.onText(/\/ayuda/, async (msg) => {
  await bot.sendMessage(msg.chat.id,
    '📖 *Comandos disponibles:*\n\n/start — Iniciar el bot\n/campanas — Ver campañas activas\n/puntos — Ver tu saldo de puntos\n/canjear — Canjear puntos por un premio\n/ayuda — Ver esta lista\n\n📸 *Envía una foto* de tu factura para acumular puntos automáticamente.',
    { parse_mode: 'Markdown' },
  )
})

// ─── Mensajes no reconocidos ────────────────────────────────────────────────
bot.on('message', async (msg) => {
  if (msg.text?.startsWith('/') || msg.photo) return
  await bot.sendMessage(msg.chat.id,
    'No entendí ese mensaje 🤔\nEscribe /ayuda para ver los comandos disponibles\no /campanas para participar en una promoción.',
  )
})

// Manejo de errores de polling
bot.on('polling_error', (err) => console.error('[polling_error]', err))

console.log('✅ Bot listo. Esperando mensajes...')
