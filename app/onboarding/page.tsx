'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Building2, Palette, CheckCircle2, Loader2,
  UtensilsCrossed, ShoppingBag, Fuel, Globe,
  Dumbbell, Sparkles, Briefcase, Music,
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

/** Input de texto con estilos del tema oscuro */
function DarkInput({
  id, label, value, onChange, placeholder, optional = false
}: {
  id: string; label: string; value: string
  onChange: (v: string) => void; placeholder: string; optional?: boolean
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-[#94A3B8] text-sm">
        {label}
        {optional && <span className="text-[#475569] text-xs">(opcional)</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6] transition-all"
      />
    </div>
  )
}

/**
 * Onboarding de 3 pasos para nuevas empresas.
 * Requiere sesión activa. Crea la empresa en Supabase al finalizar.
 */
export default function OnboardingPage() {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)

  // Paso 1
  const [nombre, setNombre] = useState('')
  const [sitioWeb, setSitioWeb] = useState('')
  const [industria, setIndustria] = useState('otro')

  // Paso 2
  const [colorPrimario, setColorPrimario] = useState('#5B5CF6')
  const [colorSecundario, setColorSecundario] = useState('#22C55E')

  // Paso 3
  const [creando, setCreando] = useState(false)
  const [empresaCreada, setEmpresaCreada] = useState(false)

  const progreso = (paso / 3) * 100

  useEffect(() => {
    const verificar = async () => {
      const usuario = await getUsuarioActual()
      if (!usuario) {
        router.push('/')
        return
      }
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
      setCargandoSesion(false)
    }
    verificar()
  }, [router])

  const avanzar = () => setPaso((p) => Math.min(p + 1, 3))
  const retroceder = () => setPaso((p) => Math.max(p - 1, 1))

  const handleFinalizar = async () => {
    if (!userId) return
    setCreando(true)
    try {
      await crearEmpresa(userId, {
        nombre,
        sitio_web: sitioWeb || undefined,
        color_primario: colorPrimario,
        color_secundario: colorSecundario,
        industria,
      })
      localStorage.removeItem('freepol_registro')
      setEmpresaCreada(true)
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.5 },
        colors: [colorPrimario, colorSecundario, '#A855F7', '#F59E0B'],
      })
    } catch (e) {
      toast.error('Error al crear la empresa. Intenta de nuevo.')
    } finally {
      setCreando(false)
    }
  }

  if (cargandoSesion) {
    return (
      <div className="h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#5B5CF6] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (empresaCreada) {
    return (
      <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-6 shadow-xl shadow-[#5B5CF6]/30">
          <span className="text-4xl">🎉</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-3">
          ¡Bienvenido a FREEPOL, <span className="gradient-text">{nombre}</span>!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-[#94A3B8] mb-8 max-w-sm">
          Tu cuenta está lista. Ahora crea tu primera campaña con la IA.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          onClick={() => router.push('/chat')}
          className="px-8 py-4 rounded-xl gradient-bg text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#5B5CF6]/25">
          Ir a crear mi primera campaña →
        </motion.button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155', borderRadius: '12px' } }} />

      {/* Header */}
      <header className="flex-shrink-0 px-6 py-5 border-b border-[#1E293B] flex items-center gap-2">
        <Zap size={18} className="text-[#5B5CF6]" />
        <span className="font-bold text-white"><span className="text-[#5B5CF6]">FREE</span>POL</span>
        <span className="text-[#334155] ml-4 text-sm text-[#64748B]">Configuración inicial</span>
      </header>

      {/* Barra progreso */}
      <Progress value={progreso} className="rounded-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Indicador de pasos */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`flex items-center gap-2 ${n < 3 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                  n < paso ? 'gradient-bg text-white' : n === paso ? 'border-2 border-[#5B5CF6] text-[#5B5CF6]' : 'border-2 border-[#334155] text-[#475569]'
                }`}>
                  {n < paso ? '✓' : n}
                </div>
                {n < 3 && <div className={`flex-1 h-px transition-colors ${n < paso ? 'bg-[#5B5CF6]' : 'bg-[#334155]'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {paso === 1 && (
              <motion.div key="paso1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <Building2 size={22} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Cuéntanos sobre tu empresa</h2>
                  <p className="text-[#94A3B8]">Esta información personaliza tus campañas</p>
                </div>
                <div className="space-y-4">
                  <DarkInput id="nombre" label="Nombre de tu empresa" value={nombre} onChange={setNombre} placeholder="Ej: Pollo Campero" />
                  <DarkInput id="sitio" label="Sitio web" value={sitioWeb} onChange={setSitioWeb} placeholder="https://tuempresa.com" optional />
                  <div className="space-y-2">
                    <label className="text-[#94A3B8] text-sm">¿En qué industria está tu negocio?</label>
                    <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                      {INDUSTRIAS.map((ind) => {
                        const Icono = ind.icono
                        const activo = industria === ind.valor
                        return (
                          <button key={ind.valor} onClick={() => setIndustria(ind.valor)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${activo ? 'border-[#5B5CF6] bg-[#1E293B]' : 'border-[#334155] bg-[#1E293B] hover:border-[#5B5CF6]/40'}`}>
                            <Icono size={16} className={activo ? 'text-[#5B5CF6]' : 'text-[#475569]'} />
                            <span className={`text-sm ${activo ? 'text-[#E2E8F0] font-medium' : 'text-[#94A3B8]'}`}>{ind.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {paso === 2 && (
              <motion.div key="paso2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <Palette size={22} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Personaliza tu marca</h2>
                  <p className="text-[#94A3B8]">Así se verán las landing pages de tus campañas</p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Color primario', value: colorPrimario, onChange: setColorPrimario },
                      { label: 'Color secundario', value: colorSecundario, onChange: setColorSecundario },
                    ].map((c) => (
                      <div key={c.label} className="space-y-2">
                        <label className="text-[#94A3B8] text-sm">{c.label}</label>
                        <div className="flex items-center gap-3 bg-[#1E293B] border border-[#334155] rounded-xl p-3">
                          <input type="color" value={c.value} onChange={(e) => c.onChange(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                          <span className="text-[#E2E8F0] font-mono text-sm">{c.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preview en tiempo real */}
                  <div className="bg-[#0F172A] border border-[#334155] rounded-2xl p-4 space-y-3">
                    <p className="text-[#475569] text-xs uppercase tracking-wide">Preview de tu campaña</p>
                    <div className="bg-white rounded-xl p-4 space-y-3">
                      <div className="text-center">
                        <p className="font-bold text-lg" style={{ color: colorPrimario }}>{nombre || 'Tu empresa'}</p>
                        <p className="text-[#64748B] text-sm">Campaña de fidelización</p>
                      </div>
                      <div className="bg-[#F8FAFC] rounded-lg p-3 text-sm text-[#0F172A] text-center">
                        ¡Participa y gana premios increíbles!
                      </div>
                      <div className="flex gap-2 justify-center">
                        <span className="text-xs px-3 py-1 rounded-full font-medium text-white" style={{ backgroundColor: colorSecundario }}>Activa</span>
                        <button className="text-sm px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: colorPrimario }}>
                          Participar →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {paso === 3 && (
              <motion.div key="paso3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <CheckCircle2 size={22} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">¡Todo listo para empezar!</h2>
                  <p className="text-[#94A3B8]">Confirma los datos de tu empresa</p>
                </div>

                <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Empresa', valor: nombre },
                      { label: 'Industria', valor: INDUSTRIAS.find((i) => i.valor === industria)?.label ?? industria },
                      { label: 'Sitio web', valor: sitioWeb || 'No especificado' },
                    ].map((item) => (
                      <div key={item.label} className="bg-[#0F172A] rounded-xl p-3">
                        <p className="text-[#64748B] text-xs uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-[#E2E8F0] font-semibold text-sm truncate">{item.valor}</p>
                      </div>
                    ))}
                    <div className="bg-[#0F172A] rounded-xl p-3">
                      <p className="text-[#64748B] text-xs uppercase tracking-wide mb-2">Colores</p>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full border border-[#334155]" style={{ backgroundColor: colorPrimario }} />
                        <div className="w-6 h-6 rounded-full border border-[#334155]" style={{ backgroundColor: colorSecundario }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navegación */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={retroceder} disabled={paso === 1}
              className="px-5 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-[#CBD5E1] text-sm hover:bg-[#334155] disabled:opacity-0 disabled:pointer-events-none transition-all">
              ← Atrás
            </button>

            {paso < 3 ? (
              <button onClick={avanzar} disabled={paso === 1 && !nombre.trim()}
                className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity">
                Siguiente →
              </button>
            ) : (
              <button onClick={handleFinalizar} disabled={creando}
                className="px-6 py-3 rounded-xl gradient-bg text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
                {creando ? <><Loader2 size={16} className="animate-spin" /> Creando...</> : '🚀 Crear mi empresa'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
