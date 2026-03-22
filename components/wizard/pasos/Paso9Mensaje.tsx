'use client'

import { useState } from 'react'
import { MessageSquare, Sparkles, Loader2 } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const MAX_CHARS = 200

export default function Paso9Mensaje() {
  const { config, setConfig } = useWizardStore()
  const [generando, setGenerando] = useState(false)

  const mensaje = config.mensaje_bienvenida ?? ''

  const handleChange = (v: string) => {
    if (v.length <= MAX_CHARS) setConfig('mensaje_bienvenida', v)
  }

  const regenerar = async () => {
    setGenerando(true)
    try {
      const res = await fetch('/api/generar-mensaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      })
      const data = await res.json() as { mensaje?: string; error?: string }
      if (data.mensaje) {
        setConfig('mensaje_bienvenida', data.mensaje)
        toast.success('Mensaje regenerado', { icon: '✨' })
      } else {
        toast.error(data.error ?? 'Error al generar')
      }
    } catch {
      toast.error('Error de red')
    } finally {
      setGenerando(false)
    }
  }

  const sugerencias = [
    {
      label: 'Más formal',
      fn: () => handleChange(mensaje.replace(/!/g, '.').replace(/🎉|🎡|⭐|🎟️|📄/g, '')),
    },
    {
      label: 'Más amigable',
      fn: () => handleChange(`¡Hola! 👋 ${mensaje}`),
    },
    {
      label: 'Más corto',
      fn: () => handleChange(mensaje.split('.')[0] ?? mensaje),
    },
  ]

  return (
    <PasoLayout
      icono={MessageSquare}
      titulo="El mensaje de bienvenida"
      subtitulo="Lo primero que verán tus clientes al llegar"
    >
      <div className="space-y-5">
        {/* Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[#94A3B8] text-sm">Mensaje de bienvenida</label>
            <span className={`text-xs ${mensaje.length > 180 ? 'text-orange-400' : 'text-[#475569]'}`}>
              {mensaje.length} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            value={mensaje}
            onChange={(e) => handleChange(e.target.value)}
            rows={4}
            placeholder="Describe el mensaje de bienvenida de tu campaña..."
            className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6] resize-none transition-all"
          />
        </div>

        {/* Botón regenerar */}
        <Button
          onClick={regenerar}
          disabled={generando}
          variant="outline"
          className="border-[#5B5CF6] text-[#5B5CF6] hover:bg-[#5B5CF6]/10 flex items-center gap-2"
        >
          {generando ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          {generando ? 'Generando...' : '✨ Regenerar con IA'}
        </Button>

        {/* Preview estilo WhatsApp */}
        {mensaje && (
          <div className="space-y-2">
            <p className="text-[#64748B] text-xs uppercase tracking-wide">
              Preview en WhatsApp
            </p>
            <div className="bg-[#1A2F1A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {config.nombre_negocio?.[0]?.toUpperCase() ?? 'F'}
                  </span>
                </div>
                <span className="text-[#22C55E] text-sm font-semibold">
                  {config.nombre_negocio || 'Tu empresa'}
                </span>
              </div>
              <div className="bg-[#1E4620] rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                <p className="text-white text-sm leading-relaxed">{mensaje}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sugerencias rápidas */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#475569] text-xs">Ajustar tono:</span>
          {sugerencias.map((s) => (
            <button
              key={s.label}
              onClick={s.fn}
              className="text-xs px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:border-[#5B5CF6]/50 hover:text-[#5B5CF6] transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </PasoLayout>
  )
}
