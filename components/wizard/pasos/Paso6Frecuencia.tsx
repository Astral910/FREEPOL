'use client'

import { RefreshCw, Target, Calendar, CalendarDays, Infinity } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import type { Frecuencia } from '@/types/campana'

const FRECUENCIAS: {
  valor: Frecuencia
  icono: React.ElementType
  nombre: string
  descripcion: string
  badge?: { texto: string; color: string; bg: string }
}[] = [
  {
    valor: '1_total',
    icono: Target,
    nombre: '1 vez en total',
    descripcion: 'Máxima exclusividad. Ideal para premios grandes.',
  },
  {
    valor: '1_dia',
    icono: Calendar,
    nombre: '1 vez por día',
    descripcion: 'Genera visitas recurrentes a tu negocio.',
    badge: { texto: 'Más popular', color: '#60A5FA', bg: '#1E3A5F' },
  },
  {
    valor: '1_semana',
    icono: CalendarDays,
    nombre: '1 vez por semana',
    descripcion: 'Balance entre accesibilidad y control.',
  },
  {
    valor: 'sin_limite',
    icono: Infinity,
    nombre: 'Sin límite',
    descripcion: 'Máxima participación. Usar con premios pequeños.',
    badge: { texto: 'Mayor riesgo', color: '#F97316', bg: '#431407' },
  },
]

export default function Paso6Frecuencia() {
  const { config, setConfig } = useWizardStore()

  return (
    <PasoLayout
      icono={RefreshCw}
      titulo="¿Cuántas veces puede participar un cliente?"
      subtitulo="Esto controla el anti-fraude automáticamente"
    >
      <div className="space-y-3">
        {FRECUENCIAS.map((f) => {
          const Icono = f.icono
          const seleccionado = config.frecuencia === f.valor
          return (
            <button
              key={f.valor}
              onClick={() => setConfig('frecuencia', f.valor)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                seleccionado
                  ? 'border-[#E8344E] bg-[#1A1B4B] shadow-md shadow-[#E8344E]/10'
                  : 'border-[#2D2F5E] bg-[#1A1B4B] hover:border-[#E8344E]/40'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  seleccionado ? 'bg-[#E8344E]/20' : 'bg-[#0A0A0A]'
                }`}
              >
                <Icono
                  size={20}
                  className={seleccionado ? 'text-[#E8344E]' : 'text-[#475569]'}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[#E2E8F0] font-semibold text-sm">{f.nombre}</p>
                  {f.badge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ color: f.badge.color, backgroundColor: f.badge.bg }}
                    >
                      {f.badge.texto}
                    </span>
                  )}
                </div>
                <p className="text-[#64748B] text-xs mt-0.5">{f.descripcion}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  seleccionado ? 'border-[#E8344E] bg-[#E8344E]' : 'border-[#475569]'
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
