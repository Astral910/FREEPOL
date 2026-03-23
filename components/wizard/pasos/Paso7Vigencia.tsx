'use client'

import { useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import { Label } from '@/components/ui/label'

const DIAS_SEMANA = [
  { id: 'lunes', label: 'L' },
  { id: 'martes', label: 'M' },
  { id: 'miercoles', label: 'X' },
  { id: 'jueves', label: 'J' },
  { id: 'viernes', label: 'V' },
  { id: 'sabado', label: 'S' },
  { id: 'domingo', label: 'D' },
]

function DateInput({
  id,
  label,
  value,
  onChange,
  min,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  min?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#94A3B8] text-sm">{label}</Label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6] transition-all [color-scheme:dark]"
      />
    </div>
  )
}

export default function Paso7Vigencia() {
  const { config, setConfig } = useWizardStore()
  const [conHorario, setConHorario] = useState(!!(config.horario_inicio || config.horario_fin))
  const hoy = new Date().toISOString().split('T')[0]

  const diasActivos = config.dias_activos ?? []

  const toggleDia = (dia: string) => {
    const nuevos = diasActivos.includes(dia)
      ? diasActivos.filter((d) => d !== dia)
      : [...diasActivos, dia]
    setConfig('dias_activos', nuevos.length > 0 ? nuevos : null)
  }

  // Calcular días de vigencia
  let diasVigencia: number | null = null
  if (config.fecha_inicio && config.fecha_fin) {
    try {
      diasVigencia = differenceInDays(parseISO(config.fecha_fin), parseISO(config.fecha_inicio))
    } catch { /* fechas inválidas */ }
  }

  return (
    <PasoLayout
      icono={CalendarRange}
      titulo="¿Cuándo estará activa tu campaña?"
      subtitulo="Define el período y horario de tu campaña"
    >
      <div className="space-y-5">
        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <DateInput
            id="fecha_inicio"
            label="Fecha de inicio"
            value={config.fecha_inicio}
            onChange={(v) => setConfig('fecha_inicio', v)}
            min={hoy}
          />
          <DateInput
            id="fecha_fin"
            label="Fecha de fin"
            value={config.fecha_fin}
            onChange={(v) => setConfig('fecha_fin', v)}
            min={config.fecha_inicio || hoy}
          />
        </div>

        {/* Resumen visual de vigencia */}
        {diasVigencia !== null && diasVigencia > 0 && (
          <div className="flex items-center gap-3 bg-[#022C22] border border-[#064E3B] rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-[#064E3B] flex items-center justify-center flex-shrink-0">
              <span className="text-[#22C55E] font-bold text-sm">{diasVigencia}</span>
            </div>
            <p className="text-[#22C55E] text-sm">
              Tu campaña estará activa <strong>{diasVigencia} días</strong>
            </p>
          </div>
        )}

        {/* Toggle horario específico */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[#1E293B] border border-[#334155] rounded-xl">
            <div
              className={`w-10 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${conHorario ? 'bg-[#5B5CF6]' : 'bg-[#334155]'}`}
              onClick={() => {
                setConHorario(!conHorario)
                if (conHorario) {
                  setConfig('horario_inicio', null)
                  setConfig('horario_fin', null)
                  setConfig('dias_activos', null)
                }
              }}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${conHorario ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <div>
              <p className="text-[#E2E8F0] text-sm font-medium">¿Tu campaña tiene horario específico?</p>
              <p className="text-[#64748B] text-xs">Por ejemplo: solo de lunes a viernes de 9am a 6pm</p>
            </div>
          </div>

          {conHorario && (
            <div className="space-y-4 pl-2">
              {/* Horarios */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#94A3B8] text-sm">Hora de inicio</Label>
                  <input
                    type="time"
                    value={config.horario_inicio ?? ''}
                    onChange={(e) => setConfig('horario_inicio', e.target.value || null)}
                    className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6] [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#94A3B8] text-sm">Hora de fin</Label>
                  <input
                    type="time"
                    value={config.horario_fin ?? ''}
                    onChange={(e) => setConfig('horario_fin', e.target.value || null)}
                    className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6] [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Días de la semana */}
              <div className="space-y-2">
                <Label className="text-[#94A3B8] text-sm">Días activos</Label>
                <div className="flex gap-2 flex-wrap">
                  {DIAS_SEMANA.map((dia) => {
                    const activo = diasActivos.includes(dia.id)
                    return (
                      <button
                        key={dia.id}
                        onClick={() => toggleDia(dia.id)}
                        className={`w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200 ${
                          activo
                            ? 'gradient-bg text-white shadow-sm'
                            : 'bg-[#1E293B] border border-[#334155] text-[#64748B] hover:border-[#5B5CF6]/50'
                        }`}
                      >
                        {dia.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PasoLayout>
  )
}
