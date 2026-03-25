'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, CheckCircle2, Loader2,
  UtensilsCrossed, ShoppingBag, Fuel, Globe,
  Dumbbell, Sparkles, Briefcase, Music, Rocket,
  Star, Crown, Check,
} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { getUsuarioActual } from '@/lib/auth-helpers'
import { crearEmpresa } from '@/lib/empresa'
import { Progress } from '@/components/ui/progress'

const INDUSTRIAS = [
  { valor: 'restaurantes', label: 'Restaurantes y comida', icono: UtensilsCrossed },
  { valor: 'retail', label: 'Retail y tiendas', icono: ShoppingBag },
  { valor: 'gasolineras', label: 'Gasolineras y combustible', icono: Fuel },
  { valor: 'ecommerce', label: 'E-commerce y tienda online', icono: Globe },
  { valor: 'gimnasios', label: 'Gimnasios y bienestar', icono: Dumbbell },
  { valor: 'belleza', label: 'Belleza y cuidado personal', icono: Sparkles },
  { valor: 'servicios', label: 'Servicios profesionales', icono: Briefcase },
  { valor: 'entretenimiento', label: 'Entretenimiento', icono: Music },
  { valor: 'otro', label: 'Otro', icono: Building2 },
]

const PLANES = [
  {
    id: 'free',
    nombre: 'Free',
    precio: '$0',
    subtitulo: 'Para empezar y probar',
    icono: Rocket,
    color: '#64748B',
    border: 'border-[#2D2F5E]',
    bg: 'bg-[#1A1B4B]',
    features: [
      '2 campañas activas',
      'Hasta 1,000 participantes/mes',
      'Landing page generada',
      'Bot de Telegram',
      'Códigos QR únicos',
    ],
  },
  {
    id: 'starter',
    nombre: 'Starter',
    precio: '$19',
    subtitulo: 'Para negocios locales',
    icono: Star,
    color: '#22C55E',
    border: 'border-[#22C55E]',
    bg: 'bg-[#064E3B]/20',
    badge: 'Para negocios locales',
    features: [
      '5 campañas activas',
      'Hasta 3,000 participantes/mes',
      'WhatsApp Business básico',
      'Dashboard con métricas',
      'Exportar participantes CSV',
    ],
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precio: '$49',
    subtitulo: 'Para negocios en crecimiento',
    icono: Crown,
    color: '#E8344E',
    border: 'border-[#E8344E]',
    bg: 'bg-[#1A1B4B]/30',
    badge: '⭐ Más popular',
    features: [
      'Campañas ilimitadas',
      'Hasta 10,000 participantes/mes',
      'Bot de Instagram',
      'Reportes y exportación avanzados',
      'Colaboraciones entre empresas',
    ],
  },
  {
    id: 'enterprise',
    nombre: 'Enterprise',
    precio: '$149',
    subtitulo: 'Para cadenas y empresas grandes',
    icono: Sparkles,
    color: '#F59E0B',
    border: 'border-[#F59E0B]',
    bg: 'bg-[#1A1B4B]',
    features: [
      'Participantes ilimitados',
      'OCR de facturas con IA',
      'Red de alianzas múltiples',
      'API REST para integraciones',
      'Soporte dedicado 24/7',
    ],
  },
]

function DarkInput({ id, label, value, onChange, placeholder, optional = false }: {
  id: string; label: string; value: string
  onChange: (v: string) => void; placeholder: string; optional?: boolean
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm text-[#94A3B8]">
        {label}
        {optional && <span className="text-xs text-[#475569]">(opcional)</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#64748B] transition-all focus:border-[#E8344E] focus:outline-none focus:ring-1 focus:ring-[#E8344E]/40"
      />
    </div>
  )
}

/**
 * Onboarding de 3 pasos para nuevas empresas.
 * Paso 1: Datos de empresa e industria
 * Paso 2: Selección de plan (solo visual, sin cobro real)
 * Paso 3: Confirmación y creación
 */
export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paso, setPaso] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)

  // Paso 1
  const [nombre, setNombre] = useState('')
  const [sitioWeb, setSitioWeb] = useState('')
  const [industria, setIndustria] = useState('otro')

  // Paso 2 — Plan
  const [planSeleccionado, setPlanSeleccionado] = useState('free')

  // Paso 3
  const [creando, setCreando] = useState(false)
  const [empresaCreada, setEmpresaCreada] = useState(false)

  const TOTAL_PASOS = 3
  const progreso = (paso / TOTAL_PASOS) * 100

  useEffect(() => {
    const verificar = async () => {
      const usuario = await getUsuarioActual()
      if (!usuario) { router.push('/'); return }
      setUserId(usuario.id)

      // Pre-llenar con datos del registro guardados en localStorage
      const raw = localStorage.getItem('freepol_registro')
      if (raw) {
        try {
          const datos = JSON.parse(raw) as { nombre_empresa?: string; sitio_web?: string }
          if (datos.nombre_empresa) setNombre(datos.nombre_empresa)
          if (datos.sitio_web) setSitioWeb(datos.sitio_web)
        } catch { /* ignorar */ }
      }

      // Pre-seleccionar plan si viene de /precios?plan=X
      const planParam = searchParams.get('plan')
      if (planParam && PLANES.find((p) => p.id === planParam)) {
        setPlanSeleccionado(planParam)
      }

      setCargandoSesion(false)
    }
    verificar()
  }, [router, searchParams])

  const avanzar = () => setPaso((p) => Math.min(p + 1, TOTAL_PASOS))
  const retroceder = () => setPaso((p) => Math.max(p - 1, 1))

  const handleFinalizar = async () => {
    if (!userId) return
    setCreando(true)
    try {
      await crearEmpresa(userId, {
        nombre,
        sitio_web: sitioWeb || undefined,
        industria,
        plan: planSeleccionado,
      })
      localStorage.removeItem('freepol_registro')
      setEmpresaCreada(true)
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#E8344E', '#22C55E', '#F2839A', '#F59E0B'],
      })
    } catch {
      toast.error('Error al crear la empresa. Intenta de nuevo.')
    } finally {
      setCreando(false)
    }
  }

  if (cargandoSesion) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E8344E] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (empresaCreada) {
    const planInfo = PLANES.find((p) => p.id === planSeleccionado)
    return (
      <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-6 shadow-xl shadow-[#E8344E]/30">
          <span className="text-4xl">🎉</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-2">
          ¡Bienvenido a FREEPOL, <span className="gradient-text">{nombre}</span>!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-[#64748B] text-sm mb-1">
          Plan activado: <span className="font-semibold" style={{ color: planInfo?.color }}>{planInfo?.nombre}</span>
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-[#94A3B8] mb-8 max-w-sm">
          Tu cuenta está lista. Ahora crea tu primera campaña con la IA.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          onClick={() => router.push('/chat')}
          className="px-8 py-4 rounded-xl gradient-bg text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#E8344E]/25">
          Ir a crear mi primera campaña →
        </motion.button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0A0A0A',
            color: '#F8FAFC',
            border: '1px solid rgba(232, 52, 78, 0.35)',
            borderRadius: '12px',
          },
        }}
      />

      <header className="flex flex-shrink-0 items-center gap-3 border-b border-white/10 px-6 py-5">
        <img
          src="/Letras_efecto_fondo_negro.png"
          alt="FREEPOL"
          width={120}
          height={30}
          className="h-8 w-auto mix-blend-screen"
        />
        <span className="text-sm font-semibold text-[#94A3B8]">Configuración inicial</span>
      </header>

      <Progress value={progreso} className="h-2 rounded-none bg-white/10" />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Indicador de pasos */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`flex items-center gap-1 ${n < 3 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                  n < paso ? 'gradient-bg text-white' : n === paso ? 'border-2 border-[#E8344E] text-[#E8344E]' : 'border-2 border-[#2D2F5E] text-[#475569]'
                }`}>
                  {n < paso ? '✓' : n}
                </div>
                {n < 3 && <div className={`flex-1 h-px transition-colors ${n < paso ? 'bg-[#E8344E]' : 'bg-[#2D2F5E]'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* PASO 1 — Empresa e industria */}
            {paso === 1 && (
              <motion.div key="paso1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <Building2 size={22} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white">Cuéntanos sobre tu empresa</h2>
                  <p className="text-[#94A3B8]">Esta información personaliza tus campañas</p>
                </div>
                <div className="space-y-4">
                  <DarkInput id="nombre" label="Nombre de tu empresa" value={nombre} onChange={setNombre} placeholder="Ej: Pollo Campero" />
                  <DarkInput id="sitio" label="Sitio web" value={sitioWeb} onChange={setSitioWeb} placeholder="https://tuempresa.com" optional />
                  <div className="space-y-2">
                    <label className="text-[#94A3B8] text-sm">¿En qué industria está tu negocio?</label>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                      {INDUSTRIAS.map((ind) => {
                        const Icono = ind.icono
                        const activo = industria === ind.valor
                        return (
                          <button key={ind.valor} onClick={() => setIndustria(ind.valor)}
                            type="button"
                            className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${activo ? 'border-[#E8344E] bg-[#E8344E]/10' : 'border-white/10 bg-white/5 hover:border-[#E8344E]/40'}`}>
                            <Icono size={16} className={activo ? 'text-[#E8344E]' : 'text-[#475569]'} />
                            <span className={`text-sm ${activo ? 'text-[#E2E8F0] font-medium' : 'text-[#94A3B8]'}`}>{ind.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASO 2 — Selección de plan */}
            {paso === 2 && (
              <motion.div key="paso2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <Crown size={22} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white">Elige tu plan</h2>
                  <p className="text-[#94A3B8]">Puedes cambiar de plan en cualquier momento desde tu perfil</p>
                </div>
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-1">
                  {PLANES.map((plan) => {
                    const Icono = plan.icono
                    const activo = planSeleccionado === plan.id
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setPlanSeleccionado(plan.id)}
                        type="button"
                        className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${activo ? 'border-[#E8344E] bg-[#E8344E]/10' : 'border-white/10 bg-white/5 hover:border-[#E8344E]/30'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${plan.color}20` }}>
                              <Icono size={17} style={{ color: plan.color }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-sm">{plan.nombre}</span>
                                {plan.badge && (
                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{ backgroundColor: `${plan.color}25`, color: plan.color }}>
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[#64748B] text-xs">{plan.subtitulo}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-white font-bold">{plan.precio}<span className="text-[#64748B] text-xs font-normal">/mes</span></span>
                            {activo && (
                              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: plan.color }}>
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-1">
                          {plan.features.map((f) => (
                            <div key={f} className="flex items-center gap-2">
                              <Check size={11} style={{ color: plan.color }} className="flex-shrink-0" />
                              <span className="text-[#94A3B8] text-xs">{f}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* PASO 3 — Confirmación */}
            {paso === 3 && (
              <motion.div key="paso3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <CheckCircle2 size={22} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white">¡Todo listo para empezar!</h2>
                  <p className="text-[#94A3B8]">Confirma los datos de tu empresa</p>
                </div>
                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Empresa', valor: nombre },
                      { label: 'Industria', valor: INDUSTRIAS.find((i) => i.valor === industria)?.label ?? industria },
                      { label: 'Sitio web', valor: sitioWeb || 'No especificado' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-[#0A0A0A] p-3 sm:col-span-1">
                        <p className="text-[#64748B] text-xs uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-[#E2E8F0] font-semibold text-sm truncate">{item.valor}</p>
                      </div>
                    ))}
                  </div>
                  {/* Plan seleccionado */}
                  {(() => {
                    const planInfo = PLANES.find((p) => p.id === planSeleccionado)!
                    const PlanIcono = planInfo.icono
                    return (
                      <div className="bg-[#0A0A0A] rounded-xl p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${planInfo.color}20` }}>
                          <PlanIcono size={15} style={{ color: planInfo.color }} />
                        </div>
                        <div>
                          <p className="text-[#64748B] text-xs uppercase tracking-wide">Plan seleccionado</p>
                          <p className="text-[#E2E8F0] font-bold text-sm">{planInfo.nombre} — {planInfo.precio}/mes</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navegación */}
          <div className="flex items-center justify-between mt-8">
            <button type="button" onClick={retroceder} disabled={paso === 1}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-[#CBD5E1] transition-all hover:bg-white/10 disabled:pointer-events-none disabled:opacity-0">
              ← Atrás
            </button>

            {paso < TOTAL_PASOS ? (
              <button
                type="button"
                onClick={avanzar}
                disabled={paso === 1 && !nombre.trim()}
                className="w-full rounded-xl bg-[#E8344E] px-6 py-4 text-sm font-black text-white transition-opacity hover:brightness-110 disabled:opacity-40 sm:w-auto">
                Siguiente →
              </button>
            ) : (
              <button type="button" onClick={handleFinalizar} disabled={creando}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8344E] px-6 py-4 text-sm font-black text-white transition-opacity hover:brightness-110 disabled:opacity-60 sm:w-auto">
                {creando ? <><Loader2 size={16} className="animate-spin" /> Creando...</> : '🚀 Crear mi empresa'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
