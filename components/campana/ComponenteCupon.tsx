'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Download, Loader2, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import confetti from 'canvas-confetti'
import type { CampanaRow } from '@/app/c/[slug]/page'

interface CodigoData {
  codigo: string
  premio: string
  expira_en: string
}

interface Props {
  campana: CampanaRow
  participanteId: string
}

/** Skeleton de carga animado para mientras se genera el código */
function SkeletonCodigo() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-[#F1F5F9] rounded-lg w-2/3 mx-auto" />
      <div className="h-16 bg-[#F1F5F9] rounded-xl" />
      <div className="w-48 h-48 bg-[#F1F5F9] rounded-xl mx-auto" />
      <div className="h-4 bg-[#F1F5F9] rounded w-1/2 mx-auto" />
    </div>
  )
}

/**
 * Componente para campañas de tipo cupón directo.
 * Genera el código automáticamente al montar.
 */
export default function ComponenteCupon({ campana, participanteId }: Props) {
  const cfg = campana.configuracion
  const [datos, setDatos] = useState<CodigoData | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const generarCodigo = async () => {
      try {
        const res = await fetch('/api/generar-codigo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campana_id: campana.id,
            participante_id: participanteId,
          }),
        })
        const data = await res.json() as CodigoData & { error?: string }

        if (!res.ok) {
          setError(data.error ?? 'Error al generar tu cupón')
          return
        }

        setDatos(data)

        // Confetti suave al aparecer el cupón
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#E8344E', '#22C55E', '#F2839A'],
        })
      } catch {
        setError('Error de conexión. Recarga la página.')
      } finally {
        setCargando(false)
      }
    }

    generarCodigo()
  }, [campana.id, participanteId])

  const copiarCodigo = async () => {
    if (!datos?.codigo) return
    await navigator.clipboard.writeText(datos.codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const descargarQR = () => {
    if (!datos?.codigo) return
    const svg = document.querySelector('#qr-cupon svg') as SVGElement | null
    if (!svg) return

    const canvas = document.createElement('canvas')
    const size = 300
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const a = document.createElement('a')
      a.download = `cupon-${datos.codigo}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const abrirDeepLink = () => {
    if (!cfg.deep_link_url) return
    window.location.href = cfg.deep_link_url
    // Fallback: si no navega en 2s, abrir en nueva pestaña
    setTimeout(() => {
      window.open(cfg.deep_link_url!, '_blank')
    }, 2000)
  }

  if (cargando) return <SkeletonCodigo />

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-4 text-sm text-center">
        {error}
      </div>
    )
  }

  if (!datos) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Título */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-[#0F172A]">¡Tu cupón está listo! 🎉</h2>
        <p className="text-[#64748B] text-base">{datos.premio}</p>
      </div>

      {/* Código */}
      <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
        <span className="flex-1 text-2xl font-mono font-bold text-[#0F172A] text-center tracking-widest">
          {datos.codigo}
        </span>
        <button
          onClick={copiarCodigo}
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
          aria-label="Copiar código"
        >
          {copiado ? (
            <Check size={16} className="text-[#22C55E]" />
          ) : (
            <Copy size={16} className="text-[#64748B]" />
          )}
        </button>
      </div>

      {/* QR */}
      <div id="qr-cupon" className="flex flex-col items-center gap-3">
        <QRCodeSVG
          value={datos.codigo}
          size={180}
          marginSize={4}
          bgColor="#ffffff"
          fgColor="#0F172A"
        />
        <button
          onClick={descargarQR}
          className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#E8344E] transition-colors"
        >
          <Download size={14} />
          Descargar QR
        </button>
      </div>

      {/* Deep link si está configurado */}
      {cfg.deep_link_url && (
        <button
          onClick={abrirDeepLink}
          className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 gradient-bg shadow-lg shadow-[#E8344E]/20 hover:opacity-90 transition-opacity"
        >
          <ExternalLink size={18} />
          Abrir en la App →
        </button>
      )}

      {/* Expiración */}
      <p className="text-sm text-[#64748B] text-center">
        Válido hasta{' '}
        <strong>
          {new Date(datos.expira_en).toLocaleString('es-GT', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </strong>{' '}
        — Muéstralo en caja
      </p>
    </motion.div>
  )
}
