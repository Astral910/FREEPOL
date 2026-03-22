'use client'

import { CheckCircle2, Pencil, Check, Trophy, Star, Ticket, Receipt, Loader2, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import { TIPO_CAMPANA_LABEL, CANAL_LABEL, FRECUENCIA_LABEL } from '@/types/campana'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { useRouter } from 'next/navigation'

const TIPO_ICONOS = {
  ruleta: Trophy,
  puntos: Star,
  cupon: Ticket,
  factura: Receipt,
}

interface CardResumenProps {
  label: string
  valor: string
  paso: number
  onEditar: (paso: number) => void
}

function CardResumen({ label, valor, paso, onEditar }: CardResumenProps) {
  return (
    <div className="group relative bg-[#0F172A] border border-[#334155] rounded-xl p-3">
      <p className="text-[#64748B] text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-[#E2E8F0] font-semibold text-sm leading-snug">{valor}</p>
      <button
        onClick={() => onEditar(paso)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[#475569] hover:text-[#5B5CF6] transition-all"
        aria-label={`Editar ${label}`}
      >
        <Pencil size={13} />
      </button>
    </div>
  )
}

export default function Paso10Resumen() {
  const { config, guardando, setGuardando, setCompletado, setPaso } = useWizardStore()
  const router = useRouter()

  const IconoTipo = TIPO_ICONOS[config.tipo] ?? Trophy

  const canalesActivos = (() => {
    if (config.canal === 'todos') return 'Todos los canales'
    return CANAL_LABEL[config.canal] ?? config.canal
  })()

  const premiosTexto = (() => {
    if (config.tipo === 'ruleta') return config.premios.map((p) => p.nombre).filter(Boolean).join(', ') || '—'
    if (config.tipo === 'puntos' || config.tipo === 'factura')
      return `${config.puntos_por_monto} pts por $${config.monto_base} · Meta: ${config.meta_canje} pts`
    return config.premios[0]?.nombre ?? '—'
  })()

  const loQueFreepol = [
    `Landing page en freepol.app/c/${config.nombre_campana?.toLowerCase().replace(/\s+/g, '-') ?? 'tu-campana'}`,
    `Bot de ${canalesActivos}`,
    'Sistema de códigos únicos con QR',
    'Dashboard de métricas en tiempo real',
    'Panel de validación para cajeros',
  ]

  const handleLanzar = async () => {
    setGuardando(true)
    try {
      const res = await fetch('/api/crear-campana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      })
      const data = await res.json() as { id?: string; slug?: string; url_campana?: string; error?: string }

      if (!res.ok) throw new Error(data.error ?? 'Error al crear campaña')

      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('freepol_config')
      }

      // Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5B5CF6', '#A855F7', '#22C55E', '#F59E0B'],
      })

      setCompletado(true)
      toast.success(`¡Campaña "${config.nombre_campana}" lanzada! 🎉`, { duration: 5000 })

      setTimeout(() => router.push('/dashboard'), 3000)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error inesperado'
      toast.error(msg)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <PasoLayout
      icono={CheckCircle2}
      titulo="¡Tu campaña está lista!"
      subtitulo="Revisa todo antes de lanzar"
    >
      <div className="space-y-6">
        {/* Grid de resumen */}
        <div className="grid grid-cols-2 gap-3">
          <CardResumen label="Tipo de campaña" valor={TIPO_CAMPANA_LABEL[config.tipo]} paso={1} onEditar={setPaso} />
          <CardResumen label="Negocio" valor={config.nombre_negocio || '—'} paso={2} onEditar={setPaso} />
          <CardResumen label="Campaña" valor={config.nombre_campana || '—'} paso={2} onEditar={setPaso} />
          <CardResumen label="Canal" valor={canalesActivos} paso={3} onEditar={setPaso} />
          <CardResumen
            label="Condición"
            valor={
              config.condicion === 'correo' ? 'Validar correo'
              : config.condicion === 'telefono' ? 'Validar teléfono'
              : config.condicion === 'quiz' ? 'Quiz 3 preguntas'
              : 'Libre'
            }
            paso={4}
            onEditar={setPaso}
          />
          <CardResumen label="Premios" valor={premiosTexto} paso={5} onEditar={setPaso} />
          <CardResumen label="Frecuencia" valor={FRECUENCIA_LABEL[config.frecuencia]} paso={6} onEditar={setPaso} />
          <CardResumen
            label="Vigencia"
            valor={config.fecha_inicio && config.fecha_fin ? `${config.fecha_inicio} → ${config.fecha_fin}` : 'Sin definir'}
            paso={7}
            onEditar={setPaso}
          />
          <CardResumen
            label="Participantes máx."
            valor={config.limite_participantes ? String(config.limite_participantes) : 'Sin límite'}
            paso={8}
            onEditar={setPaso}
          />
          <CardResumen
            label="Expira código en"
            valor={`${config.horas_expiracion_codigo}h`}
            paso={8}
            onEditar={setPaso}
          />
        </div>

        {/* Mensaje de bienvenida */}
        {config.mensaje_bienvenida && (
          <div className="relative group bg-[#0F172A] border border-[#334155] rounded-xl p-4">
            <p className="text-[#64748B] text-xs uppercase tracking-wide mb-2">Mensaje de bienvenida</p>
            <p className="text-[#E2E8F0] text-sm leading-relaxed">{config.mensaje_bienvenida}</p>
            <button onClick={() => setPaso(9)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-[#475569] hover:text-[#5B5CF6] transition-all">
              <Pencil size={13} />
            </button>
          </div>
        )}

        {/* Lo que FREEPOL creará */}
        <div className="space-y-3">
          <p className="text-[#64748B] text-xs uppercase tracking-widest font-medium">Lo que FREEPOL va a crear</p>
          <div className="space-y-2">
            {loQueFreepol.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 bg-[#022C22]/50 border border-[#064E3B]/50 rounded-lg px-3 py-2"
              >
                <Check size={14} className="text-[#22C55E] flex-shrink-0" />
                <span className="text-[#D1FAE5] text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Botón lanzar */}
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Button
            onClick={handleLanzar}
            disabled={guardando}
            className="w-full gradient-bg text-white py-4 h-auto text-lg font-bold rounded-xl flex items-center justify-center gap-3 hover:opacity-90 shadow-xl shadow-[#5B5CF6]/20"
          >
            {guardando ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creando tu campaña...
              </>
            ) : (
              <>
                <Rocket size={20} />
                🚀 Lanzar mi campaña
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </PasoLayout>
  )
}
