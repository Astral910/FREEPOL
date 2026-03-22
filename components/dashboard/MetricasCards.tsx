'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Users, Gift, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

interface Metricas {
  campanasActivas: number
  totalParticipantes: number
  totalCanjes: number
  tasaConversion: number
}

interface MetricasCardsProps {
  userId: string
  colorPrimario?: string
  supabase: SupabaseClient
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = 0
    const duration = 900
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (value - start) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  return <span>{display.toLocaleString('es-GT')}{suffix}</span>
}

async function fetchMetricas(supabase: SupabaseClient, userId: string): Promise<Metricas> {
  const { data } = await supabase
    .from('campanas')
    .select('estado, total_participantes, total_canjes')
    .eq('creado_por', userId)

  if (!data) return { campanasActivas: 0, totalParticipantes: 0, totalCanjes: 0, tasaConversion: 0 }

  const campanasActivas = data.filter((c) => c.estado === 'activa').length
  const totalParticipantes = data.reduce((a, c) => a + (c.total_participantes ?? 0), 0)
  const totalCanjes = data.reduce((a, c) => a + (c.total_canjes ?? 0), 0)
  const tasaConversion = totalParticipantes > 0 ? (totalCanjes / totalParticipantes) * 100 : 0

  return { campanasActivas, totalParticipantes, totalCanjes, tasaConversion }
}

/**
 * 4 cards de métricas del dashboard con animaciones y Realtime.
 * Los números animan desde 0 al valor real al montar.
 */
export default function MetricasCards({ userId, colorPrimario = '#5B5CF6', supabase }: MetricasCardsProps) {
  const [metricas, setMetricas] = useState<Metricas | null>(null)

  useEffect(() => {
    fetchMetricas(supabase, userId).then(setMetricas)

    // Supabase Realtime — actualiza métricas cuando cambia una campaña
    const channel: RealtimeChannel = supabase
      .channel(`metricas-${userId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'campanas', filter: `creado_por=eq.${userId}` },
        () => fetchMetricas(supabase, userId).then(setMetricas),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'campanas' },
        () => fetchMetricas(supabase, userId).then(setMetricas),
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, supabase])

  if (!metricas) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    )
  }

  const TARJETAS = [
    {
      label: 'Campañas activas',
      valor: metricas.campanasActivas,
      sufijo: '',
      subtexto: 'campañas en vivo',
      icono: Rocket,
      color: colorPrimario,
      bg: `${colorPrimario}15`,
    },
    {
      label: 'Total participantes',
      valor: metricas.totalParticipantes,
      sufijo: '',
      subtexto: 'personas registradas',
      icono: Users,
      color: '#22C55E',
      bg: '#22C55E15',
    },
    {
      label: 'Canjes realizados',
      valor: metricas.totalCanjes,
      sufijo: '',
      subtexto: 'premios entregados',
      icono: Gift,
      color: '#A855F7',
      bg: '#A855F715',
    },
    {
      label: 'Tasa de conversión',
      valor: metricas.totalParticipantes > 0 ? parseFloat(metricas.tasaConversion.toFixed(1)) : 0,
      sufijo: metricas.totalParticipantes > 0 ? '%' : '',
      subtexto: metricas.totalParticipantes > 0 ? 'tasa de conversión' : 'sin datos aún',
      icono: TrendingUp,
      color: '#F59E0B',
      bg: '#F59E0B15',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {TARJETAS.map((t, i) => {
        const Icono = t.icono
        return (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 hover:border-[#5B5CF6]/30 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#94A3B8] text-xs uppercase tracking-widest font-medium">{t.label}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.bg }}>
                <Icono size={16} style={{ color: t.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
              {metricas.totalParticipantes === 0 && t.sufijo === '%'
                ? '—'
                : <AnimatedNumber value={t.valor} suffix={t.sufijo} />}
            </p>
            <p className="text-[#64748B] text-sm mt-1">{t.subtexto}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
