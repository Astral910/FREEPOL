'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import { resolverUrlPublicaCliente } from '@/lib/app-base-url'

interface QRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
  nombreCampana: string
}

/**
 * Modal con QR grande y opción de descarga como PNG.
 * La URL usa el origen actual en el navegador para que el QR funcione en local y en producción.
 */
export default function QRModal({ open, onOpenChange, slug, nombreCampana }: QRModalProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    if (open) {
      setBaseUrl(resolverUrlPublicaCliente())
    }
  }, [open])

  const url = baseUrl ? `${baseUrl}/c/${slug}` : ''

  const copiarLink = async () => {
    const u = url || `${resolverUrlPublicaCliente()}/c/${slug}`
    await navigator.clipboard.writeText(u)
    toast.success('Link copiado al portapapeles')
  }

  const descargarPNG = () => {
    const svg = svgRef.current
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, 300, 300)
      ctx.drawImage(img, 0, 0, 300, 300)

      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `${slug}-qr.png`
      a.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-[#1A1B4B] border border-[#2D2F5E] text-[#E2E8F0] p-6">
        <DialogTitle className="text-center font-bold text-lg text-white">
          QR — {nombreCampana}
        </DialogTitle>

        <div className="flex flex-col items-center gap-4">
          {/* QR */}
          <div className="bg-white p-4 rounded-2xl shadow-md">
            {url ? (
              <QRCodeSVG
                ref={svgRef}
                value={url}
                size={220}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
                level="H"
                includeMargin
              />
            ) : (
              <div className="w-[220px] h-[220px] flex items-center justify-center text-[#64748B] text-sm text-center px-4">
                Abriendo enlace…
              </div>
            )}
          </div>

          {/* URL copiable */}
          <div className="w-full bg-[#0A0A0A] border border-[#2D2F5E] rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-[#94A3B8] text-xs truncate flex-1">
              {url || `${resolverUrlPublicaCliente()}/c/${slug}`}
            </span>
            <button onClick={copiarLink} className="text-[#E8344E] hover:text-[#F2839A] transition-colors flex-shrink-0">
              <Copy size={14} />
            </button>
          </div>

          {/* Botones */}
          <div className="flex gap-3 w-full">
            <button onClick={copiarLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#2D2F5E] text-[#94A3B8] text-sm hover:bg-[#2D2F5E] transition-colors">
              <Copy size={14} /> Copiar link
            </button>
            <button onClick={descargarPNG}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-bg text-white text-sm hover:opacity-90 transition-opacity">
              <Download size={14} /> Descargar PNG
            </button>
          </div>

          <p className="text-[#475569] text-xs text-center leading-relaxed">
            Imprime este QR y colócalo en tu negocio para que los clientes participen directamente.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
