'use client'

import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import { Label } from '@/components/ui/label'

/** Input con estilos del tema oscuro del wizard */
function WizardInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  error?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#94A3B8] text-sm">
        {label}
      </Label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#1A1B4B] border rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#E8344E] focus:border-[#E8344E] transition-all duration-200 ${
          error ? 'border-red-500' : 'border-[#2D2F5E]'
        }`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

export default function Paso2Identidad() {
  const { config, setConfig, errores } = useWizardStore()
  const [preview, setPreview] = useState({
    negocio: config.nombre_negocio,
    campana: config.nombre_campana,
  })

  // Debounce para el preview
  useEffect(() => {
    const t = setTimeout(() => {
      setPreview({
        negocio: config.nombre_negocio,
        campana: config.nombre_campana,
      })
    }, 300)
    return () => clearTimeout(t)
  }, [config.nombre_negocio, config.nombre_campana])

  return (
    <PasoLayout
      icono={Building2}
      titulo="Cuéntanos sobre tu negocio"
      subtitulo="Esta información personaliza toda tu campaña"
    >
      <div className="space-y-5">
        <WizardInput
          id="nombre_negocio"
          label="Nombre de tu empresa"
          value={config.nombre_negocio}
          onChange={(v) => setConfig('nombre_negocio', v)}
          placeholder="Ej: Pollo Campero"
          error={errores.nombre_negocio}
        />
        <WizardInput
          id="nombre_campana"
          label="Nombre de la campaña"
          value={config.nombre_campana}
          onChange={(v) => setConfig('nombre_campana', v)}
          placeholder="Ej: Sabor Ganador"
          error={errores.nombre_campana}
        />

        {/* Preview en tiempo real */}
        {(preview.negocio || preview.campana) && (
          <div className="bg-[#0A0A0A] border border-[#2D2F5E] rounded-xl p-4 mt-2">
            <p className="text-[#475569] text-xs uppercase tracking-wide mb-2">
              Tu campaña se verá así:
            </p>
            <p className="text-[#E2E8F0] font-semibold text-base">
              <span className="text-[#E8344E]">
                {preview.negocio || 'Tu empresa'}
              </span>{' '}
              presenta:{' '}
              <span className="text-white">
                {preview.campana || 'Tu campaña'}
              </span>
            </p>
          </div>
        )}
      </div>
    </PasoLayout>
  )
}
