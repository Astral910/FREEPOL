'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import toast, { Toaster } from 'react-hot-toast'
import {
  Zap, Plus, MessageSquare, LogIn, BookOpen,
  MoreHorizontal, Menu, X, ArrowLeft, LayoutDashboard,
} from 'lucide-react'
import ChatArea from '@/components/chat/ChatArea'
import ChatInput from '@/components/chat/ChatInput'
import TipsPanel from '@/components/chat/TipsPanel'
import AuthDialog from '@/components/AuthDialog'
import { createClient } from '@/lib/supabase'
import type { Empresa } from '@/lib/empresa'
import type { EstadoChat, MensajeChat, ResultadoAnalisis } from '@/types/campana'

interface CampanaHistorial {
  id: string
  nombre_campana: string
  creado_en: string
}

const HISTORIAL_SIMULADO = [
  { id: '1', titulo: 'Ruleta Pollo Campero', tiempo: 'hace 2 horas' },
  { id: '2', titulo: 'Puntos Walmart', tiempo: 'ayer' },
  { id: '3', titulo: 'Cupones Flash', tiempo: 'hace 3 días' },
]

/** Reordena las cards de sugerencias según la industria de la empresa */
function ordenarSugerenciasPorIndustria(industria: string | undefined): string[] {
  const orden = ['ruleta', 'puntos', 'cupon', 'factura']
  if (!industria) return orden
  if (industria === 'restaurantes' || industria === 'entretenimiento') return ['ruleta', 'puntos', 'cupon', 'factura']
  if (industria === 'retail' || industria === 'gasolineras') return ['factura', 'puntos', 'ruleta', 'cupon']
  if (industria === 'ecommerce') return ['cupon', 'ruleta', 'puntos', 'factura']
  return orden
}

/**
 * Página principal del chat de IA de FREEPOL.
 * Personaliza la experiencia cuando hay sesión activa.
 * La personalización es SOLO visual/textual — cero tokens extra de Groq.
 */
export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [inputValue, setInputValue] = useState('')
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [historialReal, setHistorialReal] = useState<CampanaHistorial[]>([])
  const [mensajes, setMensajes] = useState<MensajeChat[]>([])
  const [estado, setEstado] = useState<EstadoChat>('idle')
  const [resultado, setResultado] = useState<ResultadoAnalisis | null>(null)
  const [promptAnterior, setPromptAnterior] = useState('')
  const [tipsOpen, setTipsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  // true una vez que sabemos si hay sesión o no
  const [sessionCargada, setSessionCargada] = useState(false)

  // Detectar parámetros URL al montar
  useEffect(() => {
    // ?auth=required — redirigido desde middleware, abrir AuthDialog
    if (searchParams.get('auth') === 'required') {
      setAuthOpen(true)
      toast('Inicia sesión para acceder al dashboard', {
        icon: '🔐',
        style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155' },
      })
    }

    // ?prompt=[texto] — pre-cargar prompt desde /demos
    const promptParam = searchParams.get('prompt')
    if (promptParam) {
      setInputValue(decodeURIComponent(promptParam))
      toast('Prompt cargado desde demos ✨', {
        style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155' },
      })
    }
  }, [searchParams])

  // Cargar sesión y empresa — CERO tokens de Groq, solo Supabase DB
  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setSessionCargada(true)
        return
      }

      const { getEmpresaDelUsuario } = await import('@/lib/empresa')
      const emp = await getEmpresaDelUsuario(data.session.user.id)
      setEmpresa(emp)
      setSessionCargada(true)

      // Cargar últimas 3 campañas reales del usuario
      const { data: camps } = await supabase
        .from('campanas')
        .select('id,nombre_campana,creado_en')
        .eq('creado_por', data.session.user.id)
        .order('creado_en', { ascending: false })
        .limit(3)

      if (camps) setHistorialReal(camps as CampanaHistorial[])
    }
    cargar()
  }, [supabase])

  const reiniciar = useCallback(() => {
    setMensajes([])
    setEstado('idle')
    setResultado(null)
    setInputValue('')
    setPromptAnterior('')
    setSidebarOpen(false)
  }, [])

  const enviarMensaje = useCallback(async () => {
    const texto = inputValue.trim()
    if (!texto || estado === 'loading') return

    // Si no hay sesión, bloquear y abrir el dialog de login
    if (!empresa) {
      toast('Inicia sesión para crear campañas con FREEPOL', {
        icon: '🔐',
        style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #5B5CF6' },
      })
      setAuthOpen(true)
      return
    }

    const mensajeUsuario: MensajeChat = {
      id: uuidv4(),
      rol: 'usuario',
      contenido: texto,
      timestamp: new Date(),
    }

    setPromptAnterior(texto)
    setInputValue('')
    setMensajes((prev) => [...prev, mensajeUsuario])
    setEstado('loading')
    setSidebarOpen(false)

    try {
      const respuesta = await fetch('/api/analizar-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: texto }),
      })

      const data = await respuesta.json() as ResultadoAnalisis & { error?: string }

      if (!respuesta.ok) {
        throw new Error(data.error ?? 'Error al analizar el prompt')
      }

      // Agregar mensaje de respuesta de la IA antes de mostrar resultados
      const mensajeIA: MensajeChat = {
        id: uuidv4(),
        rol: 'ia',
        contenido: `✅ Analicé tu campaña "${data.config?.nombre_campana ?? 'Sin nombre'}". Encontré ${data.puede_hacer?.length ?? 0} elementos que puedo configurar perfectamente. Aquí tienes el resumen completo:`,
        timestamp: new Date(),
      }

      // Guardar la config en localStorage para que el wizard la consuma
      if (typeof window !== 'undefined') {
        localStorage.setItem('freepol_config', JSON.stringify(data))
      }

      setMensajes((prev) => [...prev, mensajeIA])
      setResultado(data)
      setEstado('results')
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error inesperado. Intenta de nuevo.'
      toast.error(mensaje, { duration: 4000 })

      const mensajeError: MensajeChat = {
        id: uuidv4(),
        rol: 'ia',
        contenido: `Lo siento, tuve un problema al analizar tu campaña. ${mensaje} Por favor intenta de nuevo.`,
        timestamp: new Date(),
      }
      setMensajes((prev) => [...prev, mensajeError])
      setEstado('idle')
    }
  }, [inputValue, estado])

  const handleSugerencia = useCallback((prompt: string) => {
    setInputValue(prompt)
  }, [])

  const handleUsarEjemploTips = useCallback((prompt: string) => {
    setInputValue(prompt)
    setTipsOpen(false)
  }, [])

  const handleAjustar = useCallback(() => {
    setInputValue(promptAnterior)
    setEstado('idle')
    setResultado(null)
    setMensajes((prev) => prev.slice(0, -1)) // quitar el último mensaje de IA
  }, [promptAnterior])

  const handleContinuarWizard = useCallback(() => {
    router.push('/wizard')
    setEstado('wizard')
  }, [router])

  const historialMostrado = historialReal.length > 0
    ? historialReal.map((c) => ({
        id: c.id,
        titulo: c.nombre_campana,
        tiempo: new Date(c.creado_en).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' }),
      }))
    : HISTORIAL_SIMULADO

  const Sidebar = (
    <aside
      className="w-72 border-r border-[#334155] flex flex-col h-full flex-shrink-0"
      style={{ backgroundColor: empresa?.color_primario ? `${empresa.color_primario}10` : undefined, background: '#1E293B' }}
    >
      {/* Header del sidebar */}
      <div className="p-5 border-b border-[#334155]">
        <Link href="/" className="flex items-center gap-2 mb-3 group">
          <ArrowLeft size={14} className="text-[#475569] group-hover:text-[#94A3B8] transition-colors" />
          <Zap size={16} className="text-[#5B5CF6]" />
          <span className="font-bold text-white">
            {empresa ? (
              <span style={{ color: empresa.color_primario }}>{empresa.nombre}</span>
            ) : (
              <Image src="/logo-dark.svg" alt="FREEPOL" width={110} height={28} priority />
            )}
          </span>
        </Link>
        <p className="text-[#64748B] text-xs mb-4">
          {empresa ? `Asistente de ${empresa.nombre}` : 'Asistente de campañas'}
        </p>
        <button
          onClick={reiniciar}
          className="w-full bg-[#5B5CF6] hover:brightness-110 text-white rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
        >
          <Plus size={16} />
          Nueva campaña
        </button>
      </div>

      {/* Historial */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-[#64748B] text-xs uppercase tracking-widest font-medium mb-3">
          Recientes
        </p>
        <div className="space-y-1">
          {historialMostrado.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#334155] cursor-pointer group transition-colors duration-150"
            >
              <MessageSquare size={14} className="text-[#475569] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[#CBD5E1] text-sm truncate">{item.titulo}</p>
                <p className="text-[#475569] text-xs">{item.tiempo}</p>
              </div>
              <MoreHorizontal size={14} className="text-[#475569] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Panel inferior del sidebar */}
      <div className="p-4 border-t border-[#334155] space-y-2">
        <button
          onClick={() => setTipsOpen(true)}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#334155] transition-colors text-[#64748B] hover:text-[#94A3B8] group"
        >
          <BookOpen size={15} />
          <span className="text-sm">Guía de prompts</span>
        </button>
        {empresa ? (
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#334155] transition-colors">
            <LayoutDashboard size={15} className="text-[#5B5CF6]" />
            <span className="text-[#5B5CF6] text-sm">Ver mis campañas →</span>
          </Link>
        ) : (
          <button
            onClick={() => setAuthOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#334155] transition-colors border border-[#5B5CF6]/30 bg-[#5B5CF6]/5"
          >
            <LogIn size={15} className="text-[#5B5CF6]" />
            <span className="text-[#5B5CF6] text-sm font-medium">Iniciar sesión para crear campañas</span>
          </button>
        )}
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#E2E8F0',
            border: '1px solid #334155',
            borderRadius: '12px',
          },
        }}
      />

      {/* Sidebar desktop */}
      <div className="hidden md:flex">{Sidebar}</div>

      {/* Sidebar móvil — overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 z-50">{Sidebar}</div>
        </div>
      )}

      {/* Área principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header móvil */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#334155] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-1.5">
            <Image src="/logo-dark.svg" alt="FREEPOL" width={100} height={25} priority />
          </div>
          <button
            onClick={() => setTipsOpen(true)}
            aria-label="Abrir guía de prompts"
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            <BookOpen size={20} />
          </button>
        </header>

        {/* Área del chat */}
        <ChatArea
          estado={estado}
          mensajes={mensajes}
          resultado={resultado}
          onSugerencia={handleSugerencia}
          onContinuarWizard={handleContinuarWizard}
          onAjustar={handleAjustar}
          onReiniciar={reiniciar}
          empresa={empresa}
          ordenSugerencias={ordenarSugerenciasPorIndustria(empresa?.industria)}
        />

        {/* Input fijo en la parte inferior — oculto en estado wizard */}
        {estado !== 'wizard' && (
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={enviarMensaje}
            onOpenTips={() => setTipsOpen(true)}
            loading={estado === 'loading'}
            disabled={estado === 'results'}
            sinSesion={sessionCargada && !empresa}
            onLoginClick={() => setAuthOpen(true)}
          />
        )}
      </main>

      {/* Panel de tips */}
      <TipsPanel
        open={tipsOpen}
        onClose={() => setTipsOpen(false)}
        onUsarEjemplo={handleUsarEjemploTips}
      />
    </div>
  )
}
