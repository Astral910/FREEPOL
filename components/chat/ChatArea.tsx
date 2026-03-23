'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Ticket, Receipt, Sparkles } from 'lucide-react'
import ResultadosAnalisis from '@/components/chat/ResultadosAnalisis'
import type { EstadoChat, MensajeChat, ResultadoAnalisis } from '@/types/campana'

interface SugerenciaCard {
  icon: React.ElementType
  color: string
  titulo: string
  descripcion: string
  promptEjemplo: string
}

const SUGERENCIAS: SugerenciaCard[] = [
  {
    icon: Trophy,
    color: '#5B5CF6',
    titulo: 'Ruleta gamificada',
    descripcion: 'Para restaurantes y cadenas de comida',
    promptEjemplo:
      'Quiero una ruleta para mi restaurante este mes. Los clientes validan su correo y pueden girar una vez al día. Premios: 10% descuento (50%), postre gratis (35%), combo completo gratis (15%). Vigente del 1 al 30 de este mes en WhatsApp.',
  },
  {
    icon: Star,
    color: '#22C55E',
    titulo: 'Sistema de puntos',
    descripcion: 'Acumulación por compras en retail',
    promptEjemplo:
      'Crea un sistema de puntos para mi tienda. Por cada $25 de compra = 1 punto. Con 40 puntos doy $10 de descuento. Los clientes suben su factura por WhatsApp. Sin límite de participaciones.',
  },
  {
    icon: Ticket,
    color: '#A855F7',
    titulo: 'Cupón de descuento',
    descripcion: 'Códigos únicos por cliente',
    promptEjemplo:
      'Quiero cupones flash para mis clientes. Ingresan su correo en Instagram y reciben un código único de 20% de descuento. Máximo 1000 cupones disponibles.',
  },
  {
    icon: Receipt,
    color: '#F59E0B',
    titulo: 'Puntos por factura',
    descripcion: 'Valida compras con foto de ticket',
    promptEjemplo:
      'Programa de puntos donde mis clientes suben foto de su factura de compra por Telegram. Por cada $30 de compra = 2 puntos. Al llegar a 20 puntos reciben un descuento de $15 en su próxima visita.',
  },
]

const MENSAJES_LOADING = [
  'Analizando tu campaña...',
  'Identificando lo que podemos construir...',
  'Preparando tu configuración...',
]

interface ChatAreaProps {
  estado: EstadoChat
  mensajes: MensajeChat[]
  resultado: ResultadoAnalisis | null
  onSugerencia: (prompt: string) => void
  onContinuarWizard: () => void
  onAjustar: () => void
  onReiniciar: () => void
  empresa?: { nombre: string; industria?: string } | null
  ordenSugerencias?: string[]
}

/**
 * Área principal del chat. Gestiona los cuatro estados visuales:
 * idle (bienvenida), loading (IA procesando), mensajes activos, y resultados.
 */
export default function ChatArea({
  estado,
  mensajes,
  resultado,
  onSugerencia,
  onContinuarWizard,
  onAjustar,
  onReiniciar,
  empresa,
  ordenSugerencias,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll automático al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, estado])

  return (
    <div className="flex-1 overflow-y-auto">
      <AnimatePresence mode="wait">

        {/* Estado idle — pantalla de bienvenida */}
        {estado === 'idle' && mensajes.length === 0 && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-full px-4 py-12"
          >
            {/* Ícono flotante */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-lg shadow-[#5B5CF6]/30"
            >
              <Sparkles size={28} className="text-white" />
            </motion.div>

            {/* Saludo personalizado si hay empresa — solo interpolación, CERO tokens */}
            <h1 className="text-3xl font-bold text-white text-center mb-3">
              {empresa
                ? `Hola, ${empresa.nombre} 👋`
                : '¿Qué campaña tienes en mente?'}
            </h1>
            <p className="text-[#94A3B8] text-center max-w-lg mx-auto leading-relaxed mb-10">
              {empresa
                ? `Soy tu asistente FREEPOL. ¿Qué campaña quieres crear hoy para ${empresa.nombre}?`
                : 'Descríbela como se te ocurra. Puedes incluir el tipo de premio, las reglas, el tiempo, los canales... Entre más detalle, mejor resultado.'}
            </p>

            {/* Grid de sugerencias — reordenadas por industria sin consumir tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mx-auto">
              {(ordenSugerencias
                ? [...SUGERENCIAS].sort((a, b) => {
                    const idA = a.titulo.toLowerCase().includes('ruleta') ? 'ruleta' : a.titulo.toLowerCase().includes('puntos') ? 'puntos' : a.titulo.toLowerCase().includes('cupón') ? 'cupon' : 'factura'
                    const idB = b.titulo.toLowerCase().includes('ruleta') ? 'ruleta' : b.titulo.toLowerCase().includes('puntos') ? 'puntos' : b.titulo.toLowerCase().includes('cupón') ? 'cupon' : 'factura'
                    return (ordenSugerencias.indexOf(idA) ?? 4) - (ordenSugerencias.indexOf(idB) ?? 4)
                  })
                : SUGERENCIAS
              ).map((s) => {
                const Icon = s.icon
                // Interpolar nombre de empresa en el prompt si hay sesión
                const prompt = empresa
                  ? s.promptEjemplo.replace('mi restaurante', empresa.nombre).replace('mi tienda', empresa.nombre).replace('mis clientes', `los clientes de ${empresa.nombre}`)
                  : s.promptEjemplo
                return (
                  <motion.button
                    key={s.titulo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSugerencia(prompt)}
                    className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 text-left cursor-pointer group transition-all duration-200 hover:border-current"
                    style={
                      { '--hover-color': s.color } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = s.color
                      e.currentTarget.style.backgroundColor = `${s.color}0D`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#334155'
                      e.currentTarget.style.backgroundColor = '#1E293B'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${s.color}20` }}
                      >
                        <Icon size={16} style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="text-[#E2E8F0] font-semibold text-sm">{s.titulo}</p>
                        <p className="text-[#64748B] text-xs mt-0.5">{s.descripcion}</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Mensajes del chat + estado loading */}
        {(mensajes.length > 0 || estado === 'loading') && estado !== 'results' && (
          <motion.div
            key="mensajes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4 p-4 md:p-6 max-w-4xl mx-auto w-full"
          >
            {mensajes.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-3 ${msg.rol === 'usuario' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar IA */}
                {msg.rol === 'ia' && (
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mb-1">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.rol === 'usuario'
                      ? 'bg-[#5B5CF6] text-white rounded-tr-none'
                      : 'bg-[#1E293B] text-[#E2E8F0] rounded-tl-none border border-[#334155]'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.contenido}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      msg.rol === 'usuario' ? 'text-white/60' : 'text-[#475569]'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('es-GT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Indicador de carga con mensajes en secuencia */}
            {estado === 'loading' && (
              <div className="flex flex-col gap-3">
                {MENSAJES_LOADING.map((texto, i) => (
                  <motion.div
                    key={texto}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.8 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                      <Sparkles size={14} className="text-white animate-spin" />
                    </div>
                    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl rounded-tl-none px-4 py-3">
                      <p className="text-[#94A3B8] text-sm">{texto}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </motion.div>
        )}

        {/* Estado results — pantalla de resultados */}
        {estado === 'results' && resultado && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 md:p-6 max-w-4xl mx-auto w-full"
          >
            <ResultadosAnalisis
              resultado={resultado}
              onContinuarWizard={onContinuarWizard}
              onAjustar={onAjustar}
              onReiniciar={onReiniciar}
            />
            <div ref={bottomRef} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
