'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Zap, MessageSquareText } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useWizardStore } from '@/store/wizardStore'
import type { ConfigCampana } from '@/types/campana'

// Importar los 10 pasos
import Paso1TipoCampana from '@/components/wizard/pasos/Paso1TipoCampana'
import Paso2Identidad from '@/components/wizard/pasos/Paso2Identidad'
import Paso3Canales from '@/components/wizard/pasos/Paso3Canales'
import Paso4Condicion from '@/components/wizard/pasos/Paso4Condicion'
import Paso5Premios from '@/components/wizard/pasos/Paso5Premios'
import Paso6Frecuencia from '@/components/wizard/pasos/Paso6Frecuencia'
import Paso7Vigencia from '@/components/wizard/pasos/Paso7Vigencia'
import Paso8Limites from '@/components/wizard/pasos/Paso8Limites'
import Paso9Mensaje from '@/components/wizard/pasos/Paso9Mensaje'
import Paso10Resumen from '@/components/wizard/pasos/Paso10Resumen'

const PASOS = [
  Paso1TipoCampana,
  Paso2Identidad,
  Paso3Canales,
  Paso4Condicion,
  Paso5Premios,
  Paso6Frecuencia,
  Paso7Vigencia,
  Paso8Limites,
  Paso9Mensaje,
  Paso10Resumen,
]

/** Valida si el paso actual permite avanzar */
function puedeAvanzar(paso: number, config: ConfigCampana): boolean {
  switch (paso) {
    case 2:
      return config.nombre_negocio.trim().length >= 2 && config.nombre_campana.trim().length >= 3
    case 5:
      if (config.tipo === 'ruleta') {
        const total = config.premios.reduce((a, p) => a + (p.probabilidad || 0), 0)
        return total === 100 && config.premios.every((p) => p.nombre.trim().length > 0)
      }
      return true
    case 7:
      return !!config.fecha_inicio && !!config.fecha_fin && config.fecha_fin >= config.fecha_inicio
    default:
      return true
  }
}

/**
 * Página principal del wizard de 10 pasos.
 * Lee la config de localStorage (clave 'freepol_config') al montar.
 * Animación de transición entre pasos: salida izquierda, entrada derecha.
 */
export default function WizardPage() {
  const router = useRouter()
  const {
    paso,
    totalPasos,
    config,
    hayDatos,
    guardando,
    completado,
    siguientePaso,
    anteriorPaso,
    cargarDesdeLocalStorage,
  } = useWizardStore()

  const [direccion, setDireccion] = useState(1) // 1 = siguiente, -1 = anterior
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDesdeLocalStorage()
    setCargando(false)
  }, [cargarDesdeLocalStorage])

  const progreso = Math.round((paso / totalPasos) * 100)
  const PasoActual = PASOS[paso - 1]
  const puedeNext = puedeAvanzar(paso, config) && !guardando
  const esUltimoPaso = paso === totalPasos

  const handleSiguiente = () => {
    setDireccion(1)
    siguientePaso()
  }

  const handleAnterior = () => {
    setDireccion(-1)
    anteriorPaso()
  }

  // Variantes de animación entre pasos
  const variantes = {
    entrar: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    centro: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: 'easeInOut' as const },
    },
    salir: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' as const },
    }),
  }

  if (cargando) {
    return (
      <div className="h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#5B5CF6] border-t-transparent animate-spin" />
      </div>
    )
  }

  // Sin datos: pedir que vuelva al chat
  if (!hayDatos) {
    return (
      <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-lg shadow-[#5B5CF6]/30">
          <MessageSquareText size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Primero describe tu campaña</h1>
        <p className="text-[#94A3B8] max-w-sm mb-8">
          El wizard se pre-llena automáticamente con los datos que la IA analiza. Ve al asistente
          y describe lo que tienes en mente.
        </p>
        <Link
          href="/chat"
          className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Zap size={16} />
          Ir al asistente de IA
        </Link>
      </div>
    )
  }

  // Pantalla de éxito (completado)
  if (completado) {
    return (
      <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-6 shadow-xl shadow-[#5B5CF6]/30"
        >
          <span className="text-4xl">🎉</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-3"
        >
          ¡Campaña lanzada!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#94A3B8] mb-8 max-w-sm"
        >
          Tu campaña <strong className="text-[#5B5CF6]">{config.nombre_campana}</strong> ya
          está activa. Redirigiendo al dashboard...
        </motion.p>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/dashboard')}
            className="gradient-bg text-white rounded-xl px-6"
          >
            Ver mi dashboard →
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/chat')}
            className="border-[#334155] text-[#94A3B8] rounded-xl px-6"
          >
            Crear otra campaña
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] overflow-hidden">
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

      {/* Barra de progreso — parte superior */}
      <Progress value={progreso} className="h-1 w-full rounded-none flex-shrink-0" />

      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#1E293B] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-1.5 text-[#475569] hover:text-[#94A3B8] transition-colors text-sm"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Volver al chat</span>
          </Link>
          <span className="text-[#334155]">|</span>
          <div className="flex items-center">
            <Image src="/logo-dark.svg" alt="FREEPOL" width={100} height={25} priority />
          </div>
        </div>
        <span className="text-[#64748B] text-sm">
          Paso <span className="text-[#94A3B8] font-semibold">{paso}</span> de{' '}
          <span className="text-[#94A3B8] font-semibold">{totalPasos}</span>
        </span>
      </header>

      {/* Contenido del paso — scrolleable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait" custom={direccion}>
            <motion.div
              key={paso}
              custom={direccion}
              variants={variantes}
              initial="entrar"
              animate="centro"
              exit="salir"
            >
              {PasoActual && <PasoActual />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer de navegación — fijo abajo */}
      <footer className="flex-shrink-0 border-t border-[#1E293B] px-4 md:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Botón atrás */}
          <div className="w-32">
            {paso > 1 && (
              <Button
                onClick={handleAnterior}
                disabled={guardando}
                className="bg-[#1E293B] text-[#CBD5E1] border border-[#334155] hover:bg-[#334155] rounded-xl flex items-center gap-2 w-full"
              >
                <ArrowLeft size={15} />
                Atrás
              </Button>
            )}
          </div>

          {/* Indicadores de paso */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPasos }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i + 1 === paso
                    ? 'w-6 h-2 gradient-bg'
                    : i + 1 < paso
                      ? 'w-2 h-2 bg-[#5B5CF6]/60'
                      : 'w-2 h-2 bg-[#334155]'
                }`}
              />
            ))}
          </div>

          {/* Botón siguiente / lanzar */}
          <div className="w-32">
            {!esUltimoPaso && (
              <Button
                onClick={handleSiguiente}
                disabled={!puedeNext}
                className={`gradient-bg text-white rounded-xl flex items-center gap-2 w-full transition-opacity ${!puedeNext ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                Siguiente
                <ArrowRight size={15} />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
