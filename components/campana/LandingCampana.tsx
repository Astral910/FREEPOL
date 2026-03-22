'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Mail, Phone, Zap, Calendar } from 'lucide-react'
import type { CampanaRow } from '@/app/c/[slug]/page'
import ComponenteRuleta from './ComponenteRuleta'
import ComponenteCupon from './ComponenteCupon'
import ComponentePuntos from './ComponentePuntos'

interface FormData {
  correo?: string
  telefono?: string
}

interface Props {
  campana: CampanaRow
}

/**
 * Landing pública de la campaña. Diseño mobile-first.
 * Flujo: formulario registro → componente de actividad (ruleta/cupón/puntos).
 */
export default function LandingCampana({ campana }: Props) {
  const cfg = campana.configuracion
  const condicion = cfg.condicion
  const tipo = campana.tipo

  const [participanteId, setParticipanteId] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [errorRegistro, setErrorRegistro] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  // Verifica si hay horario activo hoy
  const horarioActivo = (() => {
    if (!cfg.horario_inicio || !cfg.horario_fin) return null
    return `${cfg.horario_inicio} – ${cfg.horario_fin}`
  })()

  const onSubmit = async (data: FormData) => {
    setEnviando(true)
    setErrorRegistro(null)
    try {
      const body: Record<string, string> = { campana_id: campana.id }
      if (data.correo) body.correo = data.correo.toLowerCase().trim()
      if (data.telefono) body.telefono = data.telefono.trim()

      const res = await fetch('/api/registrar-participante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { participante_id?: string; error?: string; ya_registrado?: boolean }

      if (!res.ok && !json.ya_registrado) {
        const mensajes: Record<string, string> = {
          limite_alcanzado: 'Esta campaña ya alcanzó su límite de participantes.',
          ip_duplicada: 'Ya participaste desde este dispositivo.',
        }
        setErrorRegistro(mensajes[json.error ?? ''] ?? json.error ?? 'Error al registrarse')
        return
      }

      if (json.participante_id) {
        setParticipanteId(json.participante_id)
      }
    } catch {
      setErrorRegistro('Error de conexión. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const primarioColor = '#5B5CF6'

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* ZONA 1 — Header de marca */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: primarioColor }}>
            {campana.nombre_negocio}
          </h1>
          <p className="text-lg text-[#64748B]">{campana.nombre_campana}</p>
          {horarioActivo && (
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-full font-medium">
              <Calendar size={12} />
              Válido hoy de {horarioActivo}
            </div>
          )}
          <div className="h-px bg-[#E5E7EB] mt-3" />
        </div>

        {/* ZONA 2 — Mensaje de bienvenida */}
        {cfg.mensaje_bienvenida && (
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6 space-y-3">
            <p className="text-base text-[#0F172A] leading-relaxed">{cfg.mensaje_bienvenida}</p>
            {cfg.fecha_fin && (
              <p className="text-sm text-[#64748B]">
                Válido hasta{' '}
                <span className="font-medium">
                  {new Date(cfg.fecha_fin).toLocaleDateString('es-GT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
            )}
          </div>
        )}

        {/* ZONA 3 — Formulario de participación o actividad directa */}
        <AnimatePresence mode="wait">
          {!participanteId ? (
            <motion.div
              key="formulario"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {condicion === 'libre' ? (
                /* Participación libre: un solo botón */
                <button
                  onClick={() => onSubmit({})}
                  disabled={enviando}
                  className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: primarioColor }}
                >
                  {enviando ? <Loader2 size={18} className="animate-spin" /> : 'Participar ahora →'}
                </button>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {condicion === 'correo' && (
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[#0F172A] text-sm font-medium">
                        <Mail size={15} className="text-[#64748B]" />
                        Tu correo electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="nombre@correo.com"
                        autoComplete="email"
                        {...register('correo', {
                          required: 'El correo es requerido',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Ingresa un correo válido',
                          },
                        })}
                        className="w-full border border-[#E5E7EB] rounded-xl py-3.5 px-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 text-base"
                        style={{ '--tw-ring-color': primarioColor } as React.CSSProperties}
                      />
                      {errors.correo && (
                        <p className="text-red-500 text-xs">{errors.correo.message}</p>
                      )}
                    </div>
                  )}

                  {condicion === 'telefono' && (
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[#0F172A] text-sm font-medium">
                        <Phone size={15} className="text-[#64748B]" />
                        Tu número de teléfono
                      </label>
                      <input
                        type="tel"
                        placeholder="+502 1234 5678"
                        autoComplete="tel"
                        {...register('telefono', {
                          required: 'El teléfono es requerido',
                          minLength: { value: 8, message: 'Número muy corto' },
                        })}
                        className="w-full border border-[#E5E7EB] rounded-xl py-3.5 px-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 text-base"
                      />
                      {errors.telefono && (
                        <p className="text-red-500 text-xs">{errors.telefono.message}</p>
                      )}
                    </div>
                  )}

                  {errorRegistro && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                      {errorRegistro}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: primarioColor }}
                  >
                    {enviando ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      'Participar →'
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            /* ZONA 4 — Componente de actividad según tipo */
            <motion.div
              key="actividad"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tipo === 'ruleta' && (
                <ComponenteRuleta campana={campana} participanteId={participanteId} />
              )}
              {tipo === 'cupon' && (
                <ComponenteCupon campana={campana} participanteId={participanteId} />
              )}
              {(tipo === 'puntos' || tipo === 'factura') && (
                <ComponentePuntos campana={campana} participanteId={participanteId} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ZONA 5 — Footer mínimo */}
        <div className="text-center pt-4 border-t border-[#F1F5F9] space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Zap size={11} className="text-[#CBD5E1]" />
            <p className="text-xs text-[#CBD5E1]">Powered by FREEPOL</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <a href="/terminos" className="text-xs text-[#CBD5E1] hover:text-[#94A3B8] transition-colors">
              Términos
            </a>
            <span className="text-[#E5E7EB]">·</span>
            <a href="/privacidad" className="text-xs text-[#CBD5E1] hover:text-[#94A3B8] transition-colors">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
