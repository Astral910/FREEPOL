/**
 * Tipos TypeScript centrales para el módulo de campañas de FREEPOL.
 * Refleja exactamente la estructura JSON que devuelve Claude.
 */

export type EstadoChat = 'idle' | 'typing' | 'loading' | 'results' | 'wizard'

export type TipoCampana = 'ruleta' | 'puntos' | 'cupon' | 'factura'

export type Canal = 'whatsapp' | 'telegram' | 'instagram' | 'landing' | 'todos'

export type Condicion = 'correo' | 'telefono' | 'quiz' | 'libre'

export type Frecuencia = '1_total' | '1_dia' | '1_semana' | 'sin_limite'

export interface Premio {
  nombre: string
  probabilidad: number
}

export interface AlternativaItem {
  pidio: string
  razon: string
  alternativa: string
}

export interface ConfigCampana {
  nombre_negocio: string
  nombre_campana: string
  tipo: TipoCampana
  canal: Canal
  condicion: Condicion
  premios: Premio[]
  puntos_por_monto: number | null
  monto_base: number | null
  meta_canje: number | null
  frecuencia: Frecuencia
  fecha_inicio: string
  fecha_fin: string
  horario_inicio: string | null
  horario_fin: string | null
  dias_activos: string[] | null
  mensaje_bienvenida: string
  limite_participantes: number | null
  deep_link_url: string | null
  horas_expiracion_codigo: number
  /** Color de marca en la landing (hex). Opcional; por defecto #5B5CF6 */
  color_primario?: string | null
}

export interface ResultadoAnalisis {
  puede_hacer: string[]
  no_puede_hacer: string[]
  alternativas: AlternativaItem[]
  config: ConfigCampana
}

export interface MensajeChat {
  id: string
  rol: 'usuario' | 'ia'
  contenido: string
  timestamp: Date
}

/** Etiquetas legibles por tipo de campaña */
export const TIPO_CAMPANA_LABEL: Record<TipoCampana, string> = {
  ruleta: 'Ruleta de premios',
  puntos: 'Sistema de puntos',
  cupon: 'Cupón de descuento',
  factura: 'Puntos por factura',
}

/** Etiquetas legibles por canal */
export const CANAL_LABEL: Record<Canal, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  instagram: 'Instagram',
  landing: 'Landing Page',
  todos: 'Todos los canales',
}

/** Etiquetas legibles por frecuencia */
export const FRECUENCIA_LABEL: Record<Frecuencia, string> = {
  '1_total': '1 vez en total',
  '1_dia': '1 vez por día',
  '1_semana': '1 vez por semana',
  sin_limite: 'Sin límite',
}
