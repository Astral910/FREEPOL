/**
 * Sugerencias del chat (/chat) por industria de la empresa.
 * Solo interpolación de texto — cero llamadas extra a Groq.
 * Las claves deben coincidir con `empresas.industria` del onboarding.
 */

import type { LucideIcon } from 'lucide-react'
import { Trophy, Star, Ticket, Receipt } from 'lucide-react'

export type SugerenciaTipo = 'ruleta' | 'puntos' | 'cupon' | 'factura'

export type IndustriaOnboarding =
  | 'restaurantes'
  | 'retail'
  | 'gasolineras'
  | 'ecommerce'
  | 'gimnasios'
  | 'belleza'
  | 'servicios'
  | 'entretenimiento'
  | 'otro'

export interface SugerenciaCardData {
  tipo: SugerenciaTipo
  icon: LucideIcon
  color: string
  titulo: string
  descripcion: string
  /** Prompt listo para enviar (nombre de empresa ya insertado) */
  promptEjemplo: string
}

const ICONOS: Record<SugerenciaTipo, LucideIcon> = {
  ruleta: Trophy,
  puntos: Star,
  cupon: Ticket,
  factura: Receipt,
}

const COLORES: Record<SugerenciaTipo, string> = {
  ruleta: '#5B5CF6',
  puntos: '#22C55E',
  cupon: '#A855F7',
  factura: '#F59E0B',
}

/** Una variante completa: título, descripción y plantilla con {{NOMBRE}} */
interface Variante {
  titulo: string
  descripcion: string
  promptPlantilla: string
}

type Pack = Record<SugerenciaTipo, Variante>

/** Texto por defecto (visitante sin empresa o industria desconocida) */
const PACK_VISITANTE: Pack = {
  ruleta: {
    titulo: 'Ruleta gamificada',
    descripcion: 'Ideal para fidelizar con premios sorpresa',
    promptPlantilla:
      'Quiero una ruleta para {{NOMBRE}} este mes. Los clientes validan su correo y giran una vez al día. Premios: 10% descuento (50%), regalo sorpresa (35%), premio mayor (15%). Vigente este mes por WhatsApp y landing.',
  },
  puntos: {
    titulo: 'Sistema de puntos',
    descripcion: 'Acumulación por compras o visitas',
    promptPlantilla:
      'Crea un sistema de puntos para {{NOMBRE}}. Por cada $25 de compra = 1 punto. Con 40 puntos doy $10 de descuento. Los clientes se registran con correo. Sin límite de participaciones.',
  },
  cupon: {
    titulo: 'Cupón de descuento',
    descripcion: 'Códigos únicos por cliente',
    promptPlantilla:
      'Quiero cupones para {{NOMBRE}}. Los clientes ingresan su correo en la landing y reciben un código único de 20% de descuento. Máximo 1000 cupones. Códigos válidos 72 horas.',
  },
  factura: {
    titulo: 'Puntos por factura',
    descripcion: 'Valida compras con foto de ticket',
    promptPlantilla:
      'Programa donde los clientes de {{NOMBRE}} suben foto de su factura por Telegram. Por cada $30 de compra = 2 puntos. Al llegar a 20 puntos reciben $15 de descuento en su próxima compra.',
  },
}

const PACK_RESTAURANTES: Pack = {
  ruleta: {
    titulo: 'Ruleta gamificada',
    descripcion: 'Premios por visita: descuentos, postres, combos',
    promptPlantilla:
      'Quiero una ruleta para {{NOMBRE}} este mes. Los clientes validan su correo y giran una vez al día. Premios: 10% descuento en cuenta (50%), postre gratis (35%), combo completo gratis (15%). Vigente de lunes a domingo en WhatsApp y landing.',
  },
  puntos: {
    titulo: 'Puntos por consumo',
    descripcion: 'Suma puntos por ticket o delivery',
    promptPlantilla:
      'Sistema de puntos para {{NOMBRE}}: por cada Q75 de consumo en local o delivery = 1 punto. Con 12 puntos canjean un menú ejecutivo gratis. Registro con correo, participación sin límite. Quiero landing y avisos por WhatsApp.',
  },
  cupon: {
    titulo: 'Cupón de bienvenida',
    descripcion: 'Trae nuevos comensales con un código único',
    promptPlantilla:
      'Cupón de bienvenida para {{NOMBRE}}: quien se registre con correo recibe 15% de descuento en su primera visita. Código único por persona, máximo 500 cupones, válido 14 días. Landing page y botón para compartir en redes.',
  },
  factura: {
    titulo: 'Puntos por ticket',
    descripcion: 'Foto del ticket o factura para sumar puntos',
    promptPlantilla:
      'En {{NOMBRE}} los clientes suben foto de su ticket o factura por Telegram. Por cada Q50 acumulan 1 punto; a 10 puntos obtienen 2 bebidas gratis. Anti-fraude: un ticket solo una vez. Meta clara en la landing.',
  },
}

const PACK_RETAIL: Pack = {
  ruleta: {
    titulo: 'Ruleta de temporada',
    descripcion: 'Liquidaciones, 2x1 y gift cards en tu tienda',
    promptPlantilla:
      'Ruleta para {{NOMBRE}} en temporada de ofertas: correo para participar, un giro por semana por cliente. Premios: 15% en ropa (45%), gift card Q50 (35%), envío gratis (20%). Landing y WhatsApp.',
  },
  puntos: {
    titulo: 'Puntos por compra',
    descripcion: 'Más visitas, más descuentos acumulables',
    promptPlantilla:
      'Programa de puntos en {{NOMBRE}}: por cada Q100 de compra = 1 punto. A 15 puntos canjean Q75 de descuento en la siguiente compra. Registro con correo o teléfono. Quiero landing y recordatorios por WhatsApp.',
  },
  cupon: {
    titulo: 'Cupón flash',
    descripcion: 'Descuento único por registro o app',
    promptPlantilla:
      'Cupón flash para {{NOMBRE}}: 25% en una categoría seleccionada, código único por correo, máximo 300 usos, válido 48 horas. Deep link a la categoría en la tienda online si aplica.',
  },
  factura: {
    titulo: 'Puntos por factura',
    descripcion: 'Sube ticket de caja o factura electrónica',
    promptPlantilla:
      'Clientes de {{NOMBRE}} suben foto de su factura o ticket por Telegram. Por cada Q40 = 1 punto; a 20 puntos reciben Q30 de descuento. Ideal para comprobar compras reales en tienda física.',
  },
}

const PACK_GASOLINERAS: Pack = {
  ruleta: {
    titulo: 'Ruleta en tienda',
    descripcion: 'Premios en tienda: snacks, lavado, descuentos en bomba',
    promptPlantilla:
      'Ruleta para clientes de {{NOMBRE}} después de cargar combustible: validan correo en la landing, un giro por día. Premios: Q10 de descuento en gasolina (50%), bebida gratis en tienda (30%), lavado básico (20%).',
  },
  puntos: {
    titulo: 'Puntos por galón',
    descripcion: 'Acumula y canjea en tienda o combustible',
    promptPlantilla:
      'Puntos en {{NOMBRE}}: por cada 10 galones acumulados (registrados con teléfono en la landing) = 1 sello digital; 5 sellos = Q25 de descuento en la siguiente carga. Participación una vez por día.',
  },
  cupon: {
    titulo: 'Cupón con app o QR',
    descripcion: 'Incentivo por primera compra del mes',
    promptPlantilla:
      'Cupón para {{NOMBRE}}: primera compra del mes con correo registrado obtiene código único de Q15 de descuento en combustible premium. Máximo 2000 cupones, válido 7 días.',
  },
  factura: {
    titulo: 'Alianza retail + bomba',
    descripcion: 'Factura del súper suma puntos para la gasolinera',
    promptPlantilla:
      'Alianza: clientes suben factura de compras en supermercado aliado y acumulan Eco-Puntos para {{NOMBRE}}. Por cada Q25 en factura = 1 punto; 50 puntos = Q5 de descuento en combustible. Telegram y landing.',
  },
}

const PACK_ECOMMERCE: Pack = {
  ruleta: {
    titulo: 'Ruleta en checkout',
    descripcion: 'Sorpresa después del carrito o el registro',
    promptPlantilla:
      'Ruleta post-registro para {{NOMBRE}}: el cliente deja su correo y gira una vez. Premios: envío gratis (40%), 10% extra en el carrito (40%), producto sorpresa (20%). Solo en landing vinculada a la tienda.',
  },
  puntos: {
    titulo: 'Puntos por pedido',
    descripcion: 'Cashback en puntos canjeables',
    promptPlantilla:
      'Puntos en {{NOMBRE}}: por cada $50 de pedido online = 1 punto. Con 10 puntos canjean $15 de descuento en el siguiente pedido. Registro con correo, sin límite de pedidos elegibles.',
  },
  cupon: {
    titulo: 'Cupón único por email',
    descripcion: 'Descuento first-purchase o remarketing',
    promptPlantilla:
      'Cupón para {{NOMBRE}}: código único de 20% en la primera compra al registrarse con correo. Máximo 1000 cupones. Incluir botón que lleve al checkout con el cupón aplicado. Válido 72 horas.',
  },
  factura: {
    titulo: 'Puntos por orden',
    descripcion: 'Adjunta comprobante de compra B2B o mayorista',
    promptPlantilla:
      'Para clientes mayoristas de {{NOMBRE}}: suben PDF o foto de orden de compra por Telegram y suman puntos según monto. A una meta de puntos obtienen descuento escalonado en el siguiente pedido.',
  },
}

const PACK_GIMNASIOS: Pack = {
  ruleta: {
    titulo: 'Ruleta de membresía',
    descripcion: 'Clase gratis, mes cortesía, merch del gym',
    promptPlantilla:
      'Ruleta para {{NOMBRE}}: nuevos y actuales dejan correo en la landing y giran una vez al mes. Premios: clase grupal gratis (45%), descuento 20% en mensualidad el primer mes (35%), playera del gym (20%). WhatsApp y landing.',
  },
  puntos: {
    titulo: 'Puntos por asistencia',
    descripcion: 'Entrenar suma puntos canjeables',
    promptPlantilla:
      'Programa para {{NOMBRE}}: por cada 8 visitas registradas en recepción (o check-in con correo) = 1 punto de fidelidad. Con 5 puntos canjean una clase personalizada o smoothie en barra. Avisos por WhatsApp.',
  },
  cupon: {
    titulo: 'Cupón de inscripción',
    descripcion: 'Matrícula o primer mes con descuento',
    promptPlantilla:
      'Cupón para {{NOMBRE}}: quien se registre con correo recibe código único de inscripción gratis o primer mes con 30% de descuento. Máximo 150 cupones, válido 21 días. Landing con CTA claro.',
  },
  factura: {
    titulo: 'Puntos por pago',
    descripcion: 'Comprobante de mensualidad o paquete',
    promptPlantilla:
      'Clientes de {{NOMBRE}} suben foto de su recibo de pago de mensualidad o paquete por Telegram. Cada pago completo de mes suma 2 puntos; a 6 puntos obtienen 15 días gratis o upgrade de plan. Anti-fraude básico.',
  },
}

const PACK_BELLEZA: Pack = {
  ruleta: {
    titulo: 'Ruleta de servicios',
    descripcion: 'Corte, mascarilla, manicure o descuento',
    promptPlantilla:
      'Ruleta para {{NOMBRE}}: la clienta valida su correo y gira una vez por temporada. Premios: 15% en color (40%), tratamiento capilar gratis (35%), descuento en manicure (25%). Landing y recordatorio por WhatsApp.',
  },
  puntos: {
    titulo: 'Puntos por cita',
    descripcion: 'Cada visita suma para un servicio gratis',
    promptPlantilla:
      'Puntos en {{NOMBRE}}: por cada cita completada (corte, facial, etc.) = 1 punto al registrar correo. Con 6 puntos canjean un servicio básico gratis o upgrade. Ideal para salón o spa con agenda.',
  },
  cupon: {
    titulo: 'Cupón primera visita',
    descripcion: 'Atrae clientas nuevas con código único',
    promptPlantilla:
      'Cupón para {{NOMBRE}}: primera visita con 20% de descuento en cualquier servicio, código único por correo, máximo 80 cupones, válido 30 días. Landing elegante con fotos de servicios.',
  },
  factura: {
    titulo: 'Puntos por ticket',
    descripcion: 'Foto del ticket de caja del salón',
    promptPlantilla:
      'Clientes de {{NOMBRE}} suben foto de su ticket después de pagar. Por cada Q200 en servicios = 1 punto; a 5 puntos reciben tratamiento express gratis. Proceso por Telegram o landing con upload.',
  },
}

const PACK_SERVICIOS: Pack = {
  ruleta: {
    titulo: 'Ruleta de valor agregado',
    descripcion: 'Consultoría extra, plantilla o sesión bonificada',
    promptPlantilla:
      'Ruleta para clientes de {{NOMBRE}} (servicios profesionales): dejan correo y giran una vez. Premios: 1 hora de consulta bonificada (35%), descuento 15% en paquete (40%), recurso descargable premium (25%).',
  },
  puntos: {
    titulo: 'Puntos por contrato',
    descripcion: 'Proyectos cerrados suman beneficios',
    promptPlantilla:
      'Programa para {{NOMBRE}}: por cada proyecto o mes de retainer facturado, el cliente acumula 1 punto de lealtad (registrado con correo del negocio). Con 4 puntos obtienen revisión o informe sin costo.',
  },
  cupon: {
    titulo: 'Cupón diagnóstico',
    descripcion: 'Primera sesión o auditoría con descuento',
    promptPlantilla:
      'Cupón para {{NOMBRE}}: primera sesión de diagnóstico o auditoría con 25% de descuento, código único por correo corporativo, máximo 50 cupones, válido 45 días. Landing B2B.',
  },
  factura: {
    titulo: 'Puntos por factura emitida',
    descripcion: 'Sube tu factura de servicio pagada',
    promptPlantilla:
      'Clientes de {{NOMBRE}} suben su factura de servicio pagada por Telegram. Por cada Q500 en servicios acumulados = 1 punto; canje por horas de soporte o descuento en renovación de contrato.',
  },
}

const PACK_ENTRETENIMIENTO: Pack = {
  ruleta: {
    titulo: 'Ruleta de evento',
    descripcion: 'Entradas, meet & greet, merchandising',
    promptPlantilla:
      'Ruleta para {{NOMBRE}} antes del evento: el fan deja correo y gira una vez. Premios: 2 entradas VIP (10%), merchandise (30%), descuento en boletos (60%). Landing y difusión en Instagram.',
  },
  puntos: {
    titulo: 'Puntos por asistencia',
    descripcion: 'Escaneo o registro en cada función',
    promptPlantilla:
      'Puntos para asistentes de {{NOMBRE}}: por cada evento al que asistan (registro con correo) suman 1 punto. Con 5 puntos canjean upgrade de asiento o bebida gratis en la siguiente función.',
  },
  cupon: {
    titulo: 'Cupón preventa',
    descripcion: 'Código único para early birds',
    promptPlantilla:
      'Preventa para {{NOMBRE}}: correo registrado recibe cupón único de 15% en boletos de la siguiente fecha. Límite 2000 usos, válido hasta 48 h antes del show. Deep link a la taquilla online.',
  },
  factura: {
    titulo: 'Puntos por compra de boletos',
    descripcion: 'Comprobante de compra en taquilla o web',
    promptPlantilla:
      'Fans de {{NOMBRE}} suben captura o PDF de compra de boletos. Por cada Q100 gastados = 1 punto; canje por descuentos en snack bar o futuras entradas. Telegram o formulario en landing.',
  },
}

const PACK_OTRO: Pack = {
  ruleta: {
    titulo: 'Ruleta de fidelización',
    descripcion: 'Premios alineados a tu modelo de negocio',
    promptPlantilla:
      'Quiero una ruleta para {{NOMBRE}}. Los clientes validan correo y participan una vez por semana. Premios: descuento en servicio principal (50%), beneficio secundario (30%), premio sorpresa (20%). Vigencia este trimestre en landing y WhatsApp.',
  },
  puntos: {
    titulo: 'Sistema de puntos',
    descripcion: 'Reglas claras según ticket o visitas',
    promptPlantilla:
      'Sistema de puntos para {{NOMBRE}}: define regla simple (por compra, visita o referido). Los clientes se registran con correo y ven su saldo en la landing. Meta de canje con premio tangible. Sin límite de acumulación mensual.',
  },
  cupon: {
    titulo: 'Cupón por registro',
    descripcion: 'Código único para nuevos clientes',
    promptPlantilla:
      'Cupón para {{NOMBRE}}: registro con correo genera código único de descuento en el producto o servicio estrella. Límite de cupones y vigencia en días. Landing y opción de compartir.',
  },
  factura: {
    titulo: 'Validación con comprobante',
    descripcion: 'Foto de recibo o factura para puntos o sorteos',
    promptPlantilla:
      'Programa para {{NOMBRE}} donde los clientes suben foto de comprobante de pago o factura. Puntos según monto o elegibilidad para sorteo mensual. Canal Telegram o carga en landing.',
  },
}

/** Mapa industria (onboarding) → pack de textos */
const PACKS: Record<IndustriaOnboarding, Pack> = {
  restaurantes: PACK_RESTAURANTES,
  retail: PACK_RETAIL,
  gasolineras: PACK_GASOLINERAS,
  ecommerce: PACK_ECOMMERCE,
  gimnasios: PACK_GIMNASIOS,
  belleza: PACK_BELLEZA,
  servicios: PACK_SERVICIOS,
  entretenimiento: PACK_ENTRETENIMIENTO,
  otro: PACK_OTRO,
}

const ORDEN_TIPOS: SugerenciaTipo[] = ['ruleta', 'puntos', 'cupon', 'factura']

function esIndustriaValida(v: string | undefined): v is IndustriaOnboarding {
  return !!v && v in PACKS
}

/**
 * Devuelve las 4 tarjetas con prompts ya interpolados con el nombre del negocio.
 * Sin empresa: pack genérico para visitantes (nombre placeholder "tu negocio").
 */
export function obtenerSugerenciasChat(
  industria: string | undefined,
  nombreEmpresa: string | undefined,
): SugerenciaCardData[] {
  const nombre = (nombreEmpresa?.trim() || 'tu negocio').replace(/\s+/g, ' ')
  const pack = esIndustriaValida(industria) ? PACKS[industria] : PACK_VISITANTE

  return ORDEN_TIPOS.map((tipo) => {
    const v = pack[tipo]
    return {
      tipo,
      icon: ICONOS[tipo],
      color: COLORES[tipo],
      titulo: v.titulo,
      descripcion: v.descripcion,
      promptEjemplo: v.promptPlantilla.replace(/\{\{NOMBRE\}\}/g, nombre),
    }
  })
}
