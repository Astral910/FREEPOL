'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { ArrowUp, Loader2, Lightbulb, LogIn, Lock } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onOpenTips: () => void
  loading: boolean
  disabled?: boolean
  /** true cuando ya sabemos que no hay sesión activa */
  sinSesion?: boolean
  /** callback para abrir el AuthDialog desde el banner */
  onLoginClick?: () => void
}

const MAX_CHARS = 1000

/**
 * Área de input del chat con textarea autosize, contador de caracteres
 * y botón de envío con estado de carga.
 * Sin sesión muestra un banner que invita a iniciar sesión.
 * Enter envía, Shift+Enter hace salto de línea.
 */
export default function ChatInput({
  value,
  onChange,
  onSend,
  onOpenTips,
  loading,
  disabled = false,
  sinSesion = false,
  onLoginClick,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!sinSesion) textareaRef.current?.focus()
  }, [sinSesion])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (puedeEnviar) onSend()
    }
  }

  const puedeEnviar = value.trim().length >= 1 && !loading && !disabled && !sinSesion
  const contadorColor =
    value.length > 950
      ? 'text-red-400'
      : value.length > 800
        ? 'text-orange-400'
        : 'text-[#475569]'

  return (
    <div className="flex-shrink-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent pt-4 pb-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto w-full space-y-2">

        {/* Banner de login — solo si no hay sesión */}
        {sinSesion && (
          <div className="flex items-center justify-between gap-3 bg-[#1A1B4B] border border-[#E8344E]/40 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Lock size={14} className="text-[#E8344E] flex-shrink-0" />
              <p className="text-[#94A3B8] text-sm">
                <span className="text-white font-medium">Inicia sesión</span> para crear y guardar tus campañas con IA
              </p>
            </div>
            <button
              onClick={onLoginClick}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8344E] text-white text-xs font-semibold hover:brightness-110 transition-all"
            >
              <LogIn size={12} />
              Entrar
            </button>
          </div>
        )}

        {/* Caja de input */}
        <div
          className={`bg-[#1A1B4B] rounded-2xl border transition-all duration-200 shadow-lg ${
            sinSesion
              ? 'border-[#2D2F5E] opacity-60'
              : value.length > 0 || loading
                ? 'border-[#E8344E] shadow-[#E8344E]/10'
                : 'border-[#2D2F5E]'
          }`}
        >
          <div className="p-4">
            <TextareaAutosize
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) onChange(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              minRows={1}
              maxRows={6}
              placeholder={
                sinSesion
                  ? 'Inicia sesión para describir tu campaña...'
                  : 'Describe tu campaña... Ej: Quiero una ruleta para mi restaurante este mes...'
              }
              disabled={loading || disabled || sinSesion}
              aria-label="Describe tu campaña de fidelización"
              className="w-full bg-transparent text-[#E2E8F0] placeholder-[#475569] text-base resize-none outline-none border-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Barra inferior */}
            <div className="flex items-center justify-between mt-3">
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

              <button
                type="button"
                onClick={sinSesion ? onLoginClick : onSend}
                disabled={!sinSesion && !puedeEnviar}
                aria-label={sinSesion ? 'Iniciar sesión' : 'Enviar mensaje'}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  sinSesion
                    ? 'bg-[#E8344E]/20 border border-[#E8344E]/40 cursor-pointer hover:bg-[#E8344E]/30'
                    : puedeEnviar
                      ? 'gradient-bg hover:scale-110 hover:shadow-lg hover:shadow-[#E8344E]/40 cursor-pointer'
                      : 'bg-[#2D2F5E] opacity-30 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : sinSesion ? (
                  <LogIn size={15} className="text-[#E8344E]" />
                ) : (
                  <ArrowUp size={16} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#475569]">
          {sinSesion
            ? 'Crea tu cuenta gratis · Sin tarjeta de crédito · Listo en 2 minutos'
            : 'FREEPOL interpreta lenguaje natural en español e inglés · Tus datos están protegidos'}
        </p>
      </div>
    </div>
  )
}
