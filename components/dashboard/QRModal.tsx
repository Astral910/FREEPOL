'use client'

import { useEffect, useRef } from 'react'
import { X, Copy, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import toast from 'react-hot-toast'

interface QRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
  nombreCampana: string
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://freepol.app'

/**
 * Modal con QR grande y opción de descarga como PNG.
 */
export default function QRModal({ open, onOpenChange, slug, nombreCampana }: QRModalProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const url = `${BASE_URL}/c/${slug}`

  const copiarLink = async () => {
    await navigator.clipboard.writeText(url)
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
      <DialogContent className="max-w-sm bg-[#1E293B] border border-[#334155] text-[#E2E8F0] p-6">
        <DialogTitle className="text-center font-bold text-lg text-white">
          QR — {nombreCampana}
        </DialogTitle>

        <div className="flex flex-col items-center gap-4">
          {/* QR */}
          <div className="bg-white p-4 rounded-2xl shadow-md">
            <QRCodeSVG
              ref={svgRef}
              value={url}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#0F172A"
              level="H"
              includeMargin
            />
          </div>

          {/* URL copiable */}
          <div className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-[#94A3B8] text-xs truncate flex-1">{url}</span>
            <button onClick={copiarLink} className="text-[#5B5CF6] hover:text-[#A855F7] transition-colors flex-shrink-0">
              <Copy size={14} />
            </button>
          </div>

          {/* Botones */}
          <div className="flex gap-3 w-full">
            <button onClick={copiarLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm hover:bg-[#334155] transition-colors">
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
