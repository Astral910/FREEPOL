'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ResultadosAnalisis from '@/components/chat/ResultadosAnalisis'
import { obtenerSugerenciasChat } from '@/lib/chat-sugerencias-industria'
import type { EstadoChat, MensajeChat, ResultadoAnalisis } from '@/types/campana'

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

  /** Textos y prompts según industria del onboarding — cero tokens Groq */
  const sugerenciasBase = useMemo(
    () => obtenerSugerenciasChat(empresa?.industria, empresa?.nombre),
    [empresa?.industria, empresa?.nombre],
  )

  const sugerenciasOrdenadas = useMemo(() => {
    if (!ordenSugerencias?.length) return sugerenciasBase
    return [...sugerenciasBase].sort(
      (a, b) =>
        (ordenSugerencias.indexOf(a.tipo) ?? 99) - (ordenSugerencias.indexOf(b.tipo) ?? 99),
    )
  }, [sugerenciasBase, ordenSugerencias])

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
              className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-lg shadow-[#E8344E]/30"
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

            {/* Grid de sugerencias — textos y prompts por industria; orden sin tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mx-auto">
              {sugerenciasOrdenadas.map((s) => {
                const Icon = s.icon
                return (
                  <motion.button
                    key={s.tipo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSugerencia(s.promptEjemplo)}
                    className="bg-[#1A1B4B] border border-[#2D2F5E] rounded-xl p-4 text-left cursor-pointer group transition-all duration-200 hover:border-current"
                    style={
                      { '--hover-color': s.color } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = s.color
                      e.currentTarget.style.backgroundColor = `${s.color}0D`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2D2F5E'
                      e.currentTarget.style.backgroundColor = '#1A1B4B'
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
                      ? 'bg-[#E8344E] text-white rounded-tr-none'
                      : 'bg-[#1A1B4B] text-[#E2E8F0] rounded-tl-none border border-[#2D2F5E]'
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
                    <div className="bg-[#1A1B4B] border border-[#2D2F5E] rounded-2xl rounded-tl-none px-4 py-3">
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
