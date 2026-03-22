'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import toast, { Toaster } from 'react-hot-toast'
import {
  Zap,
  Plus,
  MessageSquare,
  LogIn,
  BookOpen,
  MoreHorizontal,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'
import ChatArea from '@/components/chat/ChatArea'
import ChatInput from '@/components/chat/ChatInput'
import TipsPanel from '@/components/chat/TipsPanel'
import type { EstadoChat, MensajeChat, ResultadoAnalisis } from '@/types/campana'

const HISTORIAL_SIMULADO = [
  { id: '1', titulo: 'Ruleta Pollo Campero', tiempo: 'hace 2 horas' },
  { id: '2', titulo: 'Puntos Walmart', tiempo: 'ayer' },
  { id: '3', titulo: 'Cupones Flash', tiempo: 'hace 3 días' },
]

/**
 * Página principal del chat de IA de FREEPOL.
 * Layout oscuro dividido en sidebar + área principal.
 * Accesible sin autenticación para propósitos de desarrollo.
 */
export default function ChatPage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [mensajes, setMensajes] = useState<MensajeChat[]>([])
  const [estado, setEstado] = useState<EstadoChat>('idle')
  const [resultado, setResultado] = useState<ResultadoAnalisis | null>(null)
  const [promptAnterior, setPromptAnterior] = useState('')
  const [tipsOpen, setTipsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const Sidebar = (
    <aside className="w-72 bg-[#1E293B] border-r border-[#334155] flex flex-col h-full flex-shrink-0">
      {/* Header del sidebar */}
      <div className="p-5 border-b border-[#334155]">
        <Link href="/" className="flex items-center gap-2 mb-5 group">
          <ArrowLeft size={14} className="text-[#475569] group-hover:text-[#94A3B8] transition-colors" />
          <Zap size={16} className="text-[#5B5CF6]" />
          <span className="font-bold text-white">
            <span className="text-[#5B5CF6]">FREE</span>POL
          </span>
        </Link>
        <p className="text-[#64748B] text-xs mb-4">Asistente de campañas</p>
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
          {HISTORIAL_SIMULADO.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#334155] cursor-pointer group transition-colors duration-150"
            >
              <MessageSquare size={14} className="text-[#475569] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[#CBD5E1] text-sm truncate">{item.titulo}</p>
                <p className="text-[#475569] text-xs">{item.tiempo}</p>
              </div>
              <MoreHorizontal
                size={14}
                className="text-[#475569] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              />
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
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer">
          <LogIn size={15} className="text-[#5B5CF6]" />
          <span className="text-[#5B5CF6] text-sm">Iniciar sesión para guardar</span>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
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
            <Zap size={15} className="text-[#5B5CF6]" />
            <span className="font-bold text-white text-sm">
              <span className="text-[#5B5CF6]">FREE</span>POL
            </span>
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
