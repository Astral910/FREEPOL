'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Copy, Loader2, ShoppingBag, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { QRCodeSVG } from 'qrcode.react'
import type { CampanaRow } from '@/app/c/[slug]/page'
import { resolverUrlPublicaCliente } from '@/lib/app-base-url'
import { BRAND_PRIMARY } from '@/lib/brand'

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
 * Carga el saldo real desde el servidor, permite subir facturas (tipo factura),
 * simular compras en demo (tipo puntos) y canjear al alcanzar la meta.
 */
export default function ComponentePuntos({
  campana,
  participanteId,
}: Props) {
  const cfg = campana.configuracion
  const meta = cfg.meta_canje ?? 50
  const tipo = campana.tipo

  const [puntos, setPuntos] = useState<EstadoPuntos>({ total: 0, meta, alcanzadaMeta: false })
  const [codigoCanjeado, setCodigoCanjeado] = useState<CodigoCanjeado | null>(null)
  const [subiendoFactura, setSubiendoFactura] = useState(false)
  const [simulandoCompra, setSimulandoCompra] = useState(false)
  const [canjeando, setCanjeando] = useState(false)
  const [cargandoSaldo, setCargandoSaldo] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mensajeFactura, setMensajeFactura] = useState<string | null>(null)
  const [mensajeCopiado, setMensajeCopiado] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const porcentaje = Math.min((puntos.total / meta) * 100, 100)

  /** Sincroniza puntos con la base (al montar y tras acciones) */
  const cargarSaldo = useCallback(async () => {
    setCargandoSaldo(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        campana_id: campana.id,
        participante_id: participanteId,
      })
      const res = await fetch(`/api/mis-puntos?${params.toString()}`)
      const data = await res.json() as {
        total_puntos?: number
        meta_canje?: number
        alcanzaste_meta?: boolean
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? 'No se pudo cargar tu saldo')
        return
      }
      const m = data.meta_canje ?? meta
      const t = data.total_puntos ?? 0
      setPuntos({
        total: t,
        meta: m,
        alcanzadaMeta: data.alcanzaste_meta ?? t >= m,
      })
    } catch {
      setError('Error de conexión al cargar puntos')
    } finally {
      setCargandoSaldo(false)
    }
  }, [campana.id, participanteId, meta])

  useEffect(() => {
    void cargarSaldo()
  }, [cargarSaldo])

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

  const simularCompraDemo = async () => {
    setSimulandoCompra(true)
    setError(null)
    setMensajeFactura(null)
    try {
      const res = await fetch('/api/simular-compra-puntos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campana_id: campana.id,
          participante_id: participanteId,
        }),
      })
      const data = await res.json() as {
        puntos_ganados?: number
        total_puntos?: number
        meta_canje?: number
        alcanzaste_meta?: boolean
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? 'No se pudo registrar la compra simulada')
        return
      }
      setPuntos({
        total: data.total_puntos ?? 0,
        meta: data.meta_canje ?? meta,
        alcanzadaMeta: data.alcanzaste_meta ?? false,
      })
      setMensajeFactura(
        `Compra simulada: +${data.puntos_ganados ?? 0} pts. Total: ${data.total_puntos ?? 0}`,
      )
    } catch {
      setError('Error de conexión')
    } finally {
      setSimulandoCompra(false)
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
        await cargarSaldo()
        return
      }

      setCodigoCanjeado(data)
      await cargarSaldo()
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#E8344E', '#22C55E', '#F2839A'],
      })
    } catch {
      setError('Error de conexión')
    } finally {
      setCanjeando(false)
    }
  }

  const urlValidacionPremio =
    codigoCanjeado != null
      ? `${resolverUrlPublicaCliente()}/validar?codigo=${encodeURIComponent(codigoCanjeado.codigo)}`
      : ''

  const copiarLinkValidacion = async () => {
    if (!urlValidacionPremio) return
    await navigator.clipboard.writeText(urlValidacionPremio)
    setMensajeCopiado(true)
    window.setTimeout(() => setMensajeCopiado(false), 2500)
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
        <p className="text-xs text-[#64748B] leading-relaxed px-1">
          El QR abre la página de validación del negocio. El cajero confirma el premio al escanearlo o
          abrir el enlace.
        </p>
        <div className="flex justify-center">
          <QRCodeSVG value={urlValidacionPremio} size={180} marginSize={3} />
        </div>
        <button
          type="button"
          onClick={() => void copiarLinkValidacion()}
          className="w-full py-3 rounded-xl border-2 border-[#E5E7EB] text-[#0F172A] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-colors"
        >
          <Copy size={16} />
          {mensajeCopiado ? '¡Copiado!' : 'Copiar link para cajero'}
        </button>
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
      {cargandoSaldo && (
        <div className="flex items-center justify-center gap-2 py-4 text-[#64748B] text-sm">
          <Loader2 size={18} className="animate-spin" />
          Cargando tu saldo…
        </div>
      )}

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
            style={{
              background: `linear-gradient(90deg, ${BRAND_PRIMARY}, #22C55E)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-[#94A3B8] text-center">
          {puntos.alcanzadaMeta
            ? '¡Alcanzaste la meta! Puedes canjear tu premio.'
            : `Te faltan ${Math.max(0, meta - puntos.total)} puntos para canjear`}
        </p>
      </div>

      {/* Zona de subir factura (solo tipo factura) */}
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
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={subiendoFactura || cargandoSaldo}
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

      {/* Demo: acumular puntos sin factura (solo tipo puntos) */}
      {tipo === 'puntos' && !puntos.alcanzadaMeta && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#FFF0F2] border border-[#E5E7EB] rounded-2xl p-5 space-y-3">
            <p className="text-sm font-medium text-[#0F172A]">¿Cómo acumular puntos?</p>
            <p className="text-sm text-[#64748B]">
              Por cada ${cfg.monto_base ?? 10} de compra, ganas{' '}
              <strong>{cfg.puntos_por_monto ?? 1} punto(s)</strong>. Acumula{' '}
              <strong>{meta} puntos</strong> para canjear tu premio.
            </p>
            <p className="text-xs text-[#94A3B8] border-t border-[#E5E7EB] pt-3">
              <strong>Modo demo:</strong> simula una compra en el negocio para ver cómo suben los puntos
              (ideal para presentaciones sin POS real).
            </p>
          </div>
          <button
            type="button"
            onClick={() => void simularCompraDemo()}
            disabled={simulandoCompra || cargandoSaldo}
            className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 shadow-lg transition-opacity disabled:opacity-60 hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${BRAND_PRIMARY}, #F2839A)`,
            }}
          >
            {simulandoCompra ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Registrando compra…
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                Simular una compra (+{cfg.puntos_por_monto ?? 1} pts)
              </>
            )}
          </button>
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
      {puntos.alcanzadaMeta && !cargandoSaldo && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          type="button"
          onClick={() => void canjearPuntos()}
          disabled={canjeando}
          className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 gradient-bg shadow-lg shadow-[#E8344E]/20 hover:opacity-90 disabled:opacity-60 transition-opacity"
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
