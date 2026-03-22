import Anthropic from '@anthropic-ai/sdk'
import type { ResultadoAnalisis, ConfigCampana } from '@/types/campana'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/** Prompt del sistema que instruye a Claude cómo analizar campañas */
const SYSTEM_PROMPT = `Eres el motor de análisis de campañas de FREEPOL, una plataforma 
de fidelización empresarial para América Latina.

CAPACIDADES DE FREEPOL:
- Tipos de campaña: ruleta de premios (máximo 3 premios con probabilidades), 
  sistema de puntos, cupón de descuento directo, validación de facturas con OCR
- Canales disponibles: WhatsApp, Telegram, Instagram, Landing Page web
- Condiciones de participación: validar correo, validar teléfono, quiz de 3 preguntas, libre
- Frecuencia: 1 vez total, 1 vez por día, 1 vez por semana, sin límite
- Integraciones: deep linking a apps móviles, generación de QR, envío por WhatsApp

LIMITACIONES (lo que NO puede hacer):
- TikTok, Snapchat u otras plataformas no mencionadas
- Más de 3 premios en la ruleta
- Animaciones 3D o efectos visuales especiales
- Integración directa con sistemas de POS o cajas registradoras
- Pagos o transacciones monetarias reales
- Más de 2 idiomas simultáneos

INSTRUCCIONES:
Analiza el prompt del empresario y devuelve ÚNICAMENTE un JSON válido.
Sin texto adicional. Sin markdown. Sin explicaciones. Solo el JSON puro.
Si algo no está claro, usa valores por defecto razonables.
Sé generoso interpretando las intenciones del empresario.
Si piden algo que no está disponible, sugiere la alternativa más cercana.

ESTRUCTURA JSON REQUERIDA:
{
  "puede_hacer": ["string con descripción de lo que sí se configurará"],
  "no_puede_hacer": ["string con lo que no se puede hacer"],
  "alternativas": [{ "pidio": "string", "razon": "string", "alternativa": "string" }],
  "config": {
    "nombre_negocio": "string",
    "nombre_campana": "string",
    "tipo": "ruleta | puntos | cupon | factura",
    "canal": "whatsapp | telegram | instagram | landing | todos",
    "condicion": "correo | telefono | quiz | libre",
    "premios": [{ "nombre": "string", "probabilidad": 0.0 }],
    "puntos_por_monto": null,
    "monto_base": null,
    "meta_canje": null,
    "frecuencia": "1_total | 1_dia | 1_semana | sin_limite",
    "fecha_inicio": "YYYY-MM-DD",
    "fecha_fin": "YYYY-MM-DD",
    "horario_inicio": null,
    "horario_fin": null,
    "dias_activos": null,
    "mensaje_bienvenida": "string",
    "limite_participantes": null,
    "deep_link_url": null,
    "horas_expiracion_codigo": 24
  }
}`

/**
 * Analiza el prompt del empresario usando Claude y devuelve
 * la configuración estructurada de la campaña.
 * Incluye retry automático en caso de fallo de parseo.
 */
export async function analizarPromptEmpresario(
  prompt: string,
): Promise<ResultadoAnalisis> {
  const inicio = Date.now()

  const intentar = async (intentoNumero: number): Promise<ResultadoAnalisis> => {
    try {
      const respuesta = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content:
              intentoNumero === 1
                ? prompt
                : `Analiza este prompt y devuelve SOLO JSON válido, sin texto adicional:\n\n${prompt}`,
          },
        ],
      })

      const textoRespuesta =
        respuesta.content[0].type === 'text' ? respuesta.content[0].text : ''

      // Limpiar posible markdown que Claude agregue por error
      const jsonLimpio = textoRespuesta
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      const resultado = JSON.parse(jsonLimpio) as ResultadoAnalisis

      const duracion = Date.now() - inicio
      console.log(`[Claude] Análisis completado en ${duracion}ms (intento ${intentoNumero})`)

      return resultado
    } catch (error) {
      if (intentoNumero === 1) {
        console.warn('[Claude] Primer intento fallido, reintentando en 1s...', error)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return intentar(2)
      }
      throw error
    }
  }

  // Timeout de 30 segundos
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout: Claude tardó más de 30 segundos')), 30000),
  )

  return Promise.race([intentar(1), timeoutPromise])
}

/**
 * Genera un mensaje de bienvenida personalizado basado
 * en la configuración de la campaña extraída por Claude.
 */
export function generarMensajeBienvenida(config: ConfigCampana): string {
  const nombre = config.nombre_negocio || 'nuestra empresa'
  const campana = config.nombre_campana || 'esta campaña'

  const mensajesPorTipo: Record<string, string> = {
    ruleta: `¡Bienvenido a ${campana}! 🎡 Gira la ruleta y gana premios increíbles de ${nombre}. ¡Solo necesitas registrarte para participar!`,
    puntos: `¡Bienvenido al programa de lealtad de ${nombre}! ⭐ Acumula puntos con cada compra y canjéalos por increíbles beneficios.`,
    cupon: `¡Tu cupón exclusivo de ${nombre} te espera! 🎟️ Regístrate, obtén tu código único y úsalo en tu próxima compra.`,
    factura: `¡Participa en el programa de puntos de ${nombre}! 📄 Sube tu factura y convierte tus compras en increíbles premios.`,
  }

  return config.mensaje_bienvenida || mensajesPorTipo[config.tipo] || `¡Bienvenido a ${campana} de ${nombre}!`
}
