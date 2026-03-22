'use client'

import { useState } from 'react'
import { Gauge } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'

const EXPIRACIONES = [
  { horas: 24, label: '24 horas' },
  { horas: 48, label: '48 horas', badge: 'Recomendado' },
  { horas: 72, label: '72 horas' },
  { horas: 168, label: '1 semana' },
]

export default function Paso8Limites() {
  const { config, setConfig } = useWizardStore()
  const [conLimite, setConLimite] = useState(config.limite_participantes !== null)

  const toggleLimite = () => {
    const nuevo = !conLimite
    setConLimite(nuevo)
    if (!nuevo) setConfig('limite_participantes', null)
  }

  return (
    <PasoLayout
      icono={Gauge}
      titulo="¿Hay límites en tu campaña?"
      subtitulo="Controla el alcance y la expiración de premios"
    >
      <div className="space-y-6">
        {/* Toggle límite de participantes */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-[#1E293B] border border-[#334155] rounded-xl">
            <div
              className={`w-10 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${conLimite ? 'bg-[#5B5CF6]' : 'bg-[#334155]'}`}
              onClick={toggleLimite}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${conLimite ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <div>
              <p className="text-[#E2E8F0] text-sm font-medium">Limitar número de participantes</p>
              <p className="text-[#64748B] text-xs">La campaña se detiene automáticamente al llegar al límite</p>
            </div>
          </div>

          {conLimite && (
            <div className="space-y-2 pl-2">
              <label className="text-[#94A3B8] text-sm">Máximo de participantes</label>
              <input
                type="number"
                min="1"
                value={config.limite_participantes ?? ''}
                onChange={(e) =>
                  setConfig('limite_participantes', e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Ej: 5000"
                className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6]"
              />
            </div>
          )}
        </div>

        {/* Expiración del código */}
        <div className="space-y-3">
          <label className="text-[#94A3B8] text-sm">
            ¿Cuánto tiempo tiene el cliente para usar su premio?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EXPIRACIONES.map((e) => {
              const seleccionado = config.horas_expiracion_codigo === e.horas
              return (
                <button
                  key={e.horas}
                  onClick={() => setConfig('horas_expiracion_codigo', e.horas)}
                  className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                    seleccionado
                      ? 'border-[#5B5CF6] bg-[#1E293B] shadow-sm shadow-[#5B5CF6]/10'
                      : 'border-[#334155] bg-[#1E293B] hover:border-[#5B5CF6]/40'
                  }`}
                >
                  <span className={`font-bold text-sm ${seleccionado ? 'text-[#5B5CF6]' : 'text-[#E2E8F0]'}`}>
                    {e.label}
                  </span>
                  {e.badge && (
                    <span className="text-xs text-[#22C55E] bg-[#052E16] px-2 py-0.5 rounded-full mt-1">
                      {e.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </PasoLayout>
  )
}
