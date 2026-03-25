'use client'

import { ShieldCheck, Mail, Phone, HelpCircle, Zap } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import type { Condicion } from '@/types/campana'

const CONDICIONES: {
  valor: Condicion
  icono: React.ElementType
  nombre: string
  descripcion: string
  badge?: { texto: string; color: string; bg: string }
}[] = [
  {
    valor: 'correo',
    icono: Mail,
    nombre: 'Validar correo electrónico',
    descripcion: 'Alta tasa de conversión y anti-fraude',
    badge: { texto: 'Recomendado', color: '#22C55E', bg: '#052E16' },
  },
  {
    valor: 'telefono',
    icono: Phone,
    nombre: 'Registrar teléfono',
    descripcion: 'Ideal para campañas por WhatsApp',
  },
  {
    valor: 'quiz',
    icono: HelpCircle,
    nombre: 'Responder un quiz',
    descripcion: '3 preguntas sobre tu marca',
    badge: { texto: 'Mayor engagement', color: '#F97316', bg: '#431407' },
  },
  {
    valor: 'libre',
    icono: Zap,
    nombre: 'Participación libre',
    descripcion: 'Sin barreras de entrada',
    badge: { texto: 'Sin datos del cliente', color: '#94A3B8', bg: '#1A1B4B' },
  },
]

export default function Paso4Condicion() {
  const { config, setConfig } = useWizardStore()

  return (
    <PasoLayout
      icono={ShieldCheck}
      titulo="¿Qué debe hacer el cliente para participar?"
      subtitulo="Esta es la puerta de entrada a tu campaña"
    >
      <div className="space-y-3">
        {CONDICIONES.map((c) => {
          const Icono = c.icono
          const seleccionado = config.condicion === c.valor
          return (
            <button
              key={c.valor}
              onClick={() => setConfig('condicion', c.valor)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                seleccionado
                  ? 'border-[#E8344E] bg-[#1A1B4B] shadow-md shadow-[#E8344E]/10'
                  : 'border-[#2D2F5E] bg-[#1A1B4B] hover:border-[#E8344E]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
                <Icono
                  size={20}
                  className={seleccionado ? 'text-[#E8344E]' : 'text-[#475569]'}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[#E2E8F0] font-semibold text-sm">{c.nombre}</p>
                  {c.badge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ color: c.badge.color, backgroundColor: c.badge.bg }}
                    >
                      {c.badge.texto}
                    </span>
                  )}
                </div>
                <p className="text-[#64748B] text-xs mt-0.5">{c.descripcion}</p>
              </div>
              {/* Indicador */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  seleccionado
                    ? 'border-[#E8344E] bg-[#E8344E]'
                    : 'border-[#475569] bg-transparent'
                }`}
              >
                {seleccionado && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </PasoLayout>
  )
}
