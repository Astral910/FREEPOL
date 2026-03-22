'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { ArrowUp, Loader2, Lightbulb } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onOpenTips: () => void
  loading: boolean
  disabled?: boolean
}

const MAX_CHARS = 1000

/**
 * Área de input del chat con textarea autosize, contador de caracteres
 * y botón de envío con estado de carga.
 * Enter envía, Shift+Enter hace salto de línea.
 */
export default function ChatInput({
  value,
  onChange,
  onSend,
  onOpenTips,
  loading,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Enfocar el textarea al montar
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (puedeEnviar) onSend()
    }
  }

  const puedeEnviar = value.trim().length >= 1 && !loading && !disabled
  const contadorColor =
    value.length > 800
      ? 'text-orange-400'
      : value.length > 950
        ? 'text-red-400'
        : 'text-[#475569]'

  return (
    <div className="flex-shrink-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent pt-6 pb-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Caja de input */}
        <div
          className={`bg-[#1E293B] rounded-2xl border transition-all duration-200 shadow-lg ${
            value.length > 0 || loading
              ? 'border-[#5B5CF6] shadow-[#5B5CF6]/10'
              : 'border-[#334155]'
          }`}
        >
          <div className="p-4">
            <TextareaAutosize
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  onChange(e.target.value)
                }
              }}
              onKeyDown={handleKeyDown}
              minRows={1}
              maxRows={6}
              placeholder="Describe tu campaña... Ej: Quiero una ruleta para mi restaurante este mes donde los clientes validen su correo..."
              disabled={loading || disabled}
              aria-label="Describe tu campaña de fidelización"
              className="w-full bg-transparent text-[#E2E8F0] placeholder-[#475569] text-base resize-none outline-none border-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Barra inferior */}
            <div className="flex items-center justify-between mt-3">
              {/* Lado izquierdo: contador + tips */}
              <div className="flex items-center gap-3">
                <span className={`text-xs tabular-nums ${contadorColor}`}>
                  {value.length} / {MAX_CHARS}
                </span>
                <button
                  type="button"
                  onClick={onOpenTips}
                  className="flex items-center gap-1.5 text-[#64748B] hover:text-[#94A3B8] transition-colors text-xs"
                  aria-label="Abrir guía de prompts"
                >
                  <Lightbulb size={12} />
                  <span className="hidden sm:inline">Tips de prompts →</span>
                </button>
              </div>

              {/* Botón enviar */}
              <button
                type="button"
                onClick={onSend}
                disabled={!puedeEnviar}
                aria-label="Enviar mensaje"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  puedeEnviar
                    ? 'gradient-bg hover:scale-110 hover:shadow-lg hover:shadow-[#5B5CF6]/40 cursor-pointer'
                    : 'bg-[#334155] opacity-30 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <ArrowUp size={16} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Texto debajo de la caja */}
        <p className="text-center text-xs text-[#475569] mt-3">
          FREEPOL interpreta lenguaje natural en español e inglés · Tus datos están protegidos
        </p>
      </div>
    </div>
  )
}
