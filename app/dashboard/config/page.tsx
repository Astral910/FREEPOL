'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Building2, CreditCard, AlertTriangle,
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

function InputClaro({ id, label, value, onChange, placeholder, type = 'text' }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[#64748B] text-sm">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white border border-[#E5E7EB] rounded-xl py-3 px-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E8344E]/30 focus:border-[#E8344E] transition-all" />
    </div>
  )
}

/**
 * Página de configuración de la empresa (tema claro, marca FREEPOL fija).
 */
export default function ConfigPage() {
  const router = useRouter()
  const supabase = createClient()
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminarDialog, setEliminarDialog] = useState(false)

  const [nombre, setNombre] = useState('')
  const [sitioWeb, setSitioWeb] = useState('')
  const [industria, setIndustria] = useState('otro')

  const init = useCallback(async () => {
    const usuario = await getUsuarioActual()
    if (!usuario) { router.push('/'); return }

    const emp = await getEmpresaDelUsuario(usuario.id)
    if (!emp) { router.push('/onboarding'); return }

    setEmpresa(emp)
    setNombre(emp.nombre)
    setSitioWeb(emp.sitio_web ?? '')
    setIndustria(emp.industria ?? 'otro')
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
      <div className="min-h-screen bg-white p-8 space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-32 rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
      </div>
    )
  }

  const planInfo = PLAN_INFO[empresa?.plan ?? 'free'] ?? PLAN_INFO.free

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" toastOptions={{ style: { background: '#FFFFFF', color: '#0F172A', border: '1px solid #E5E7EB', borderRadius: '12px' } }} />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-8">

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#E8344E] transition-colors">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">Configuración</h1>
            <p className="text-[#64748B] text-sm">{empresa?.nombre}</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <Building2 size={16} className="text-[#E8344E]" />
            <h2 className="text-[#0F172A] font-semibold">Datos de la empresa</h2>
          </div>

          <InputClaro id="nombre" label="Nombre de la empresa" value={nombre} onChange={setNombre} placeholder="Ej: Pollo Campero" />
          <InputClaro id="sitio" label="Sitio web (opcional)" value={sitioWeb} onChange={setSitioWeb} placeholder="https://tuempresa.com" />

          <div className="space-y-2">
            <label className="text-[#64748B] text-sm">Industria</label>
            <select value={industria} onChange={(e) => setIndustria(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-xl py-3 px-4 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#E8344E]/30 focus:border-[#E8344E]">
              {INDUSTRIAS.map((i) => (
                <option key={i.valor} value={i.valor}>{i.label}</option>
              ))}
            </select>
          </div>

          <p className="text-xs text-[#64748B] flex items-start gap-2">
            <Zap size={14} className="text-[#E8344E] flex-shrink-0 mt-0.5" />
            Colores e identidad visual de campañas y del asistente son los de la marca FREEPOL y no se pueden cambiar.
          </p>

          <button onClick={guardarDatos} disabled={guardando}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Guardar cambios
          </button>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <CreditCard size={16} style={{ color: planInfo.color }} />
            <h2 className="text-[#0F172A] font-semibold">Plan actual</h2>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-lg font-bold" style={{ color: planInfo.color }}>Plan {planInfo.label}</span>
              <p className="text-[#64748B] text-sm mt-0.5">{planInfo.limite}</p>
            </div>
            <Link href="/precios"
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-sm hover:border-[#E8344E]/40 hover:text-[#E8344E] transition-all">
              Ver planes →
            </Link>
          </div>

          {empresa?.plan === 'free' && (
            <div className="bg-[#FFF0F2] border border-[#F9B8C4]/60 rounded-xl p-4">
              <p className="text-[#E8344E] text-sm font-medium">Actualiza a Starter por $19/mes</p>
              <p className="text-[#64748B] text-xs mt-0.5">5 campañas, 3,000 participantes y WhatsApp Business básico.</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-red-100">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-red-600 font-semibold">Zona de peligro</h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#0F172A] text-sm font-medium">Cerrar mi cuenta</p>
              <p className="text-[#64748B] text-xs mt-0.5">Esta acción eliminará todos tus datos permanentemente.</p>
            </div>
            <button onClick={() => setEliminarDialog(true)}
              className="flex-shrink-0 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors">
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
