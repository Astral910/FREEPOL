'use client'

import { useState } from 'react'
import { Radio, MessageCircle, Send, Globe, Info } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import type { Canal } from '@/types/campana'

const CANALES = [
  {
    id: 'whatsapp',
    icono: MessageCircle,
    color: '#22C55E',
    nombre: 'WhatsApp',
    descripcion: 'Bot conversacional para tus clientes',
  },
  {
    id: 'telegram',
    icono: Send,
    color: '#38BDF8',
    nombre: 'Telegram',
    descripcion: 'Bot con comandos y validación de facturas',
  },
  {
    id: 'instagram',
    icono: Globe,
    color: '#E1306C',
    nombre: 'Instagram',
    descripcion: 'Respuesta automática a comentarios',
  },
  {
    id: 'landing',
    icono: Globe,
    color: '#E8344E',
    nombre: 'Landing Page',
    descripcion: 'Página web generada automáticamente',
  },
]

/** Convierte el valor del canal del store en un array de IDs activos */
function canalAArray(canal: Canal): string[] {
  if (canal === 'todos') return ['whatsapp', 'telegram', 'instagram', 'landing']
  return [canal]
}

/** Convierte array de IDs al tipo Canal */
function arrayACanal(activos: string[]): Canal {
  if (activos.length === 0) return 'landing'
  if (activos.length === 4) return 'todos'
  return activos[0] as Canal
}

export default function Paso3Canales() {
  const { config, setConfig } = useWizardStore()
  const [activos, setActivos] = useState<string[]>(canalAArray(config.canal))

  const toggleCanal = (id: string) => {
    const nuevo = activos.includes(id)
      ? activos.filter((c) => c !== id)
      : [...activos, id]

    // Al menos landing siempre debe estar activo
    const final = nuevo.length === 0 ? ['landing'] : nuevo
    setActivos(final)
    setConfig('canal', arrayACanal(final))
  }

  return (
    <PasoLayout
      icono={Radio}
      titulo="¿Dónde participarán tus clientes?"
      subtitulo="Puedes activar varios canales a la vez"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CANALES.map((canal) => {
            const Icono = canal.icono
            const estaActivo = activos.includes(canal.id)
            return (
              <button
                key={canal.id}
                onClick={() => toggleCanal(canal.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  estaActivo
                    ? 'border-[#E8344E] bg-[#1A1B4B] shadow-md shadow-[#E8344E]/10'
                    : 'border-[#2D2F5E] bg-[#1A1B4B] hover:border-[#E8344E]/40'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${canal.color}20` }}
                >
                  <Icono size={20} style={{ color: canal.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#E2E8F0] font-semibold text-sm">{canal.nombre}</p>
                  <p className="text-[#64748B] text-xs">{canal.descripcion}</p>
                </div>
                {/* Toggle visual */}
                <div
                  className={`w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 relative ${
                    estaActivo ? 'bg-[#E8344E]' : 'bg-[#2D2F5E]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      estaActivo ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Nota informativa */}
        <div className="flex items-start gap-3 bg-[#1E3A5F]/50 border border-[#1D4ED8]/30 rounded-xl p-4">
          <Info size={16} className="text-[#60A5FA] flex-shrink-0 mt-0.5" />
          <p className="text-[#93C5FD] text-sm leading-relaxed">
            💡 La <strong>Landing Page</strong> siempre se crea aunque no la selecciones.
            Es el corazón de tu campaña.
          </p>
        </div>
      </div>
    </PasoLayout>
  )
}
