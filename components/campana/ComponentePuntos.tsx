'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Loader2, Upload, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { QRCodeSVG } from 'qrcode.react'
import type { CampanaRow } from '@/app/c/[slug]/page'

interface EstadoPuntos {
  total: number
  meta: number
  alcanzadaMeta: boolean
}

interface CodigoCanjeado {
  codigo: string
  premio: string
  expira_en: string
}

interface Props {
  campana: CampanaRow
  participanteId: string
}

/**
 * Componente para campañas de puntos y factura.
 * Muestra progreso, permite subir facturas y canjear cuando se alcanza la meta.
 */
export default function ComponentePuntos({ campana, participanteId }: Props) {
  const cfg = campana.configuracion
  const meta = cfg.meta_canje ?? 50
  const tipo = campana.tipo

  const [puntos, setPuntos] = useState<EstadoPuntos>({ total: 0, meta, alcanzadaMeta: false })
  const [codigoCanjeado, setCodigoCanjeado] = useState<CodigoCanjeado | null>(null)
  const [subiendoFactura, setSubiendoFactura] = useState(false)
  const [canjeando, setCanjeando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mensajeFactura, setMensajeFactura] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const porcentaje = Math.min((puntos.total / meta) * 100, 100)

  const subirFactura = async (file: File) => {
    setSubiendoFactura(true)
    setError(null)
    setMensajeFactura(null)

    const form = new FormData()
    form.append('imagen', file)
    form.append('campana_id', campana.id)
    form.append('participante_id', participanteId)

    try {
      const res = await fetch('/api/procesar-factura', {
        method: 'POST',
        body: form,
      })
      const data = await res.json() as {
        puntos_ganados?: number
        total_puntos?: number
        numero_factura?: string
        monto_detectado?: number
        meta_canje?: number
        alcanzaste_meta?: boolean
        error?: string
      }

      if (!res.ok) {
        setError(data.error ?? 'Error al procesar la factura')
        return
      }

      setPuntos({
        total: data.total_puntos ?? 0,
        meta: data.meta_canje ?? meta,
        alcanzadaMeta: data.alcanzaste_meta ?? false,
      })
      setMensajeFactura(
        `¡Factura procesada! Ganaste ${data.puntos_ganados ?? 0} puntos. Total: ${data.total_puntos ?? 0}`,
      )
    } catch {
      setError('Error de conexión al procesar la factura')
    } finally {
      setSubiendoFactura(false)
    }
  }

  const canjearPuntos = async () => {
    setCanjeando(true)
    setError(null)
    try {
      const res = await fetch('/api/generar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campana_id: campana.id,
          participante_id: participanteId,
        }),
      })
      const data = await res.json() as CodigoCanjeado & { error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Error al canjear')
        return
      }

      setCodigoCanjeado(data)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#5B5CF6', '#22C55E', '#A855F7'],
      })
    } catch {
      setError('Error de conexión')
    } finally {
      setCanjeando(false)
    }
  }

  if (codigoCanjeado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 text-center"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#0F172A]">¡Premio canjeado! 🎉</h2>
          <p className="text-[#64748B]">{cfg.premios[0]?.nombre ?? 'Premio'}</p>
        </div>
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
          <span className="text-2xl font-mono font-bold text-[#0F172A] tracking-widest">
            {codigoCanjeado.codigo}
          </span>
        </div>
        <div className="flex justify-center">
          <QRCodeSVG value={codigoCanjeado.codigo} size={180} marginSize={3} />
        </div>
        <p className="text-sm text-[#64748B]">
          Válido hasta{' '}
          <strong>
            {new Date(codigoCanjeado.expira_en).toLocaleString('es-GT', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </strong>
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#64748B]">Tus puntos</span>
          <span className="font-bold text-[#0F172A] text-sm">
            {puntos.total} / {meta}
          </span>
        </div>
        <div className="h-4 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #5B5CF6, #22C55E)' }}
            initial={{ width: 0 }}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-[#94A3B8] text-center">
          {puntos.alcanzadaMeta
            ? '¡Alcanzaste la meta! Puedes canjear tu premio.'
            : `Te faltan ${meta - puntos.total} puntos para canjear`}
        </p>
      </div>

      {/* Zona de subir factura (solo tipo factura o puntos con OCR) */}
      {tipo === 'factura' && !puntos.alcanzadaMeta && (
        <div className="space-y-3">
          <p className="text-sm text-[#64748B] text-center">
            Sube la foto de tu factura para ganar{' '}
            <strong>{cfg.puntos_por_monto ?? 1} punto(s)</strong> por cada $
            {cfg.monto_base ?? 10} de compra
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) subirFactura(file)
            }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={subiendoFactura}
            className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 gradient-bg hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {subiendoFactura ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Procesando factura...
              </>
            ) : (
              <>
                <Camera size={18} />
                Subir foto de factura
              </>
            )}
          </button>
        </div>
      )}

      {tipo === 'puntos' && !puntos.alcanzadaMeta && (
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-5 space-y-2">
          <p className="text-sm font-medium text-[#0F172A]">¿Cómo acumular puntos?</p>
          <p className="text-sm text-[#64748B]">
            Por cada ${cfg.monto_base ?? 10} de compra, ganas{' '}
            <strong>{cfg.puntos_por_monto ?? 1} punto(s)</strong>. Acumula{' '}
            <strong>{meta} puntos</strong> para canjear tu premio.
          </p>
        </div>
      )}

      {/* Mensajes de éxito/error */}
      <AnimatePresence>
        {mensajeFactura && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm"
          >
            <CheckCircle size={16} className="flex-shrink-0" />
            {mensajeFactura}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón canjear si alcanzó la meta */}
      {puntos.alcanzadaMeta && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={canjearPuntos}
          disabled={canjeando}
          className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 gradient-bg shadow-lg shadow-[#5B5CF6]/20 hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {canjeando ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Canjeando...
            </>
          ) : (
            '¡Canjear mi premio! →'
          )}
        </motion.button>
      )}
    </div>
  )
}
