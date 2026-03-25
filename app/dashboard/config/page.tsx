'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Building2, Palette, CreditCard, AlertTriangle,
  Save, Loader2, Zap,
  UtensilsCrossed, ShoppingBag, Fuel, Globe, Dumbbell,
  Sparkles, Briefcase, Music,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { getEmpresaDelUsuario, actualizarEmpresa, type Empresa } from '@/lib/empresa'
import { getUsuarioActual } from '@/lib/auth-helpers'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'

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

const PLAN_INFO: Record<string, { label: string; color: string; limite: string }> = {
  free: { label: 'Free', color: '#94A3B8', limite: '2 campañas · 1,000 participantes/mes' },
  starter: { label: 'Starter', color: '#22C55E', limite: '5 campañas · 3,000 participantes/mes' },
  pro: { label: 'Pro', color: '#E8344E', limite: 'Campañas ilimitadas · 10,000 participantes/mes' },
  enterprise: { label: 'Enterprise', color: '#F59E0B', limite: 'Sin límites · OCR · API' },
}

function InputOscuro({ id, label, value, onChange, placeholder, type = 'text' }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[#94A3B8] text-sm">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#0A0A0A] border border-[#2D2F5E] rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#E8344E] focus:border-[#E8344E] transition-all" />
    </div>
  )
}

/**
 * Página de configuración de la empresa.
 * Permite editar datos, colores de marca y ver el plan actual.
 */
export default function ConfigPage() {
  const router = useRouter()
  const supabase = createClient()
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminarDialog, setEliminarDialog] = useState(false)

  // Campos editables
  const [nombre, setNombre] = useState('')
  const [sitioWeb, setSitioWeb] = useState('')
  const [industria, setIndustria] = useState('otro')
  const [colorPrimario, setColorPrimario] = useState('#E8344E')
  const [colorSecundario, setColorSecundario] = useState('#22C55E')

  const init = useCallback(async () => {
    const usuario = await getUsuarioActual()
    if (!usuario) { router.push('/'); return }

    const emp = await getEmpresaDelUsuario(usuario.id)
    if (!emp) { router.push('/onboarding'); return }

    setEmpresa(emp)
    setNombre(emp.nombre)
    setSitioWeb(emp.sitio_web ?? '')
    setIndustria(emp.industria ?? 'otro')
    setColorPrimario(emp.color_primario)
    setColorSecundario(emp.color_secundario)
    setCargando(false)
  }, [router])

  useEffect(() => { init() }, [init])

  const guardarDatos = async () => {
    if (!empresa) return
    setGuardando(true)
    try {
      await actualizarEmpresa(empresa.id, { nombre, sitio_web: sitioWeb, industria })
      toast.success('Datos actualizados')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  const guardarColores = async () => {
    if (!empresa) return
    setGuardando(true)
    try {
      await actualizarEmpresa(empresa.id, { color_primario: colorPrimario, color_secundario: colorSecundario })
      toast.success('Colores actualizados')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  const cerrarCuenta = async () => {
    await supabase.auth.signOut()
    toast('Para eliminar tu cuenta, contacta: soporte@freepol.app', {
      icon: '📧',
      duration: 6000,
    })
    router.push('/')
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-8 space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-32 rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
      </div>
    )
  }

  const planInfo = PLAN_INFO[empresa?.plan ?? 'free'] ?? PLAN_INFO.free

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1A1B4B', color: '#E2E8F0', border: '1px solid #2D2F5E', borderRadius: '12px' } }} />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-[#1A1B4B] border border-[#2D2F5E] flex items-center justify-center text-[#64748B] hover:text-[#94A3B8] transition-colors">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Configuración</h1>
            <p className="text-[#64748B] text-sm">{empresa?.nombre}</p>
          </div>
        </div>

        {/* Sección 1: Datos */}
        <div className="bg-[#1A1B4B] border border-[#2D2F5E] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2D2F5E]">
            <Building2 size={16} className="text-[#E8344E]" />
            <h2 className="text-white font-semibold">Datos de la empresa</h2>
          </div>

          <InputOscuro id="nombre" label="Nombre de la empresa" value={nombre} onChange={setNombre} placeholder="Ej: Pollo Campero" />
          <InputOscuro id="sitio" label="Sitio web (opcional)" value={sitioWeb} onChange={setSitioWeb} placeholder="https://tuempresa.com" />

          <div className="space-y-2">
            <label className="text-[#94A3B8] text-sm">Industria</label>
            <select value={industria} onChange={(e) => setIndustria(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2D2F5E] rounded-xl py-3 px-4 text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#E8344E] focus:border-[#E8344E]">
              {INDUSTRIAS.map((i) => (
                <option key={i.valor} value={i.valor}>{i.label}</option>
              ))}
            </select>
          </div>

          <button onClick={guardarDatos} disabled={guardando}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Guardar cambios
          </button>
        </div>

        {/* Sección 2: Colores */}
        <div className="bg-[#1A1B4B] border border-[#2D2F5E] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2D2F5E]">
            <Palette size={16} className="text-[#F2839A]" />
            <h2 className="text-white font-semibold">Personalización de marca</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Color primario', value: colorPrimario, onChange: setColorPrimario },
              { label: 'Color secundario', value: colorSecundario, onChange: setColorSecundario },
            ].map((c) => (
              <div key={c.label} className="space-y-2">
                <label className="text-[#94A3B8] text-sm">{c.label}</label>
                <div className="flex items-center gap-3 bg-[#0A0A0A] border border-[#2D2F5E] rounded-xl p-3">
                  <input type="color" value={c.value} onChange={(e) => c.onChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                  <span className="text-[#E2E8F0] font-mono text-sm">{c.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-[#0A0A0A] border border-[#2D2F5E] rounded-xl p-4 space-y-2">
            <p className="text-[#475569] text-xs uppercase tracking-wide">Preview</p>
            <div className="bg-white rounded-xl p-4 space-y-2">
              <p className="font-bold text-center text-sm" style={{ color: colorPrimario }}>{nombre || 'Tu empresa'}</p>
              <div className="flex gap-2 justify-center">
                <span className="text-xs px-3 py-1 rounded-full text-white" style={{ backgroundColor: colorSecundario }}>Activa</span>
                <button className="text-xs px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: colorPrimario }}>Participar →</button>
              </div>
            </div>
          </div>

          <button onClick={guardarColores} disabled={guardando}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Guardar colores
          </button>
        </div>

        {/* Sección 3: Plan */}
        <div className="bg-[#1A1B4B] border border-[#2D2F5E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2D2F5E]">
            <CreditCard size={16} style={{ color: planInfo.color }} />
            <h2 className="text-white font-semibold">Plan actual</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold" style={{ color: planInfo.color }}>Plan {planInfo.label}</span>
              <p className="text-[#64748B] text-sm mt-0.5">{planInfo.limite}</p>
            </div>
            <Link href="/precios"
              className="px-4 py-2 rounded-xl border border-[#2D2F5E] text-[#94A3B8] text-sm hover:bg-[#2D2F5E] hover:text-[#E2E8F0] transition-all">
              Ver planes →
            </Link>
          </div>

          {empresa?.plan === 'free' && (
            <div className="bg-[#E8344E]/10 border border-[#E8344E]/30 rounded-xl p-4">
              <p className="text-[#E8344E] text-sm font-medium">Actualiza a Starter por $19/mes</p>
              <p className="text-[#4338CA] text-xs mt-0.5">5 campañas, 3,000 participantes y WhatsApp Business básico.</p>
            </div>
          )}
        </div>

        {/* Zona de peligro */}
        <div className="bg-[#1A1B4B] border border-red-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-red-400 font-semibold">Zona de peligro</h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#E2E8F0] text-sm font-medium">Cerrar mi cuenta</p>
              <p className="text-[#64748B] text-xs mt-0.5">Esta acción eliminará todos tus datos permanentemente.</p>
            </div>
            <button onClick={() => setEliminarDialog(true)}
              className="flex-shrink-0 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
              Cerrar cuenta
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={eliminarDialog} onOpenChange={setEliminarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar tu cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todos tus datos permanentemente. Los participantes y campañas no se podrán recuperar.
              Serás redirigido y deberás contactar a soporte@freepol.app para confirmar la eliminación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600" onClick={cerrarCuenta}>
              Sí, cerrar cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
