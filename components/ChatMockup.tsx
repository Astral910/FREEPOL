'use client'

import { Send } from 'lucide-react'

/**
 * Mockup visual de la interfaz de chat de FREEPOL.
 * Simula una ventana de navegador con mensajes de conversación IA.
 */
export default function ChatMockup() {
  return (
    <div
      className="max-w-3xl mx-auto mt-16 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
      style={{ transform: 'perspective(1200px) rotateX(3deg)' }}
    >
      {/* Barra de navegador simulada */}
      <div className="bg-[#1A1B4B] px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-[#0A0A0A] rounded-md px-4 py-1 flex items-center justify-center">
            <span className="text-xs text-[#64748B] font-mono">app.freepol.com/chat</span>
          </div>
        </div>
      </div>

      {/* Área del chat */}
      <div className="bg-[#0A0A0A] p-6 space-y-4 min-h-[320px]">
        {/* Mensaje de la IA (izquierda) */}
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            IA
          </div>
          <div className="bg-[#1A1B4B] text-white text-sm rounded-2xl rounded-tl-none px-4 py-3 leading-relaxed">
            Hola 👋 Soy tu asistente FREEPOL. Describe la campaña que imaginas para tu
            negocio.
          </div>
        </div>

        {/* Mensaje del empresario (derecha) */}
        <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-[#2D2F5E] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            Tú
          </div>
          <div className="bg-[#E8344E] text-white text-sm rounded-2xl rounded-tr-none px-4 py-3 leading-relaxed">
            Quiero una ruleta para Pollo Campero este mes. El cliente valida su correo,
            gira una vez y puede ganar un 15% de descuento, una pieza gratis o un menú
            completo.
          </div>
        </div>

        {/* Respuesta de la IA */}
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            IA
          </div>
          <div className="bg-[#1A1B4B] text-white text-sm rounded-2xl rounded-tl-none px-4 py-3 leading-relaxed">
            <span className="text-[#22C55E]">✅</span> Entendido. He configurado tu campaña{' '}
            <span className="font-semibold">&quot;Sabor Ganador&quot;</span>. Ruleta con 3
            premios, validación por correo, 1 giro por usuario. ¿Confirmas el lanzamiento?
          </div>
        </div>

        {/* Input falso */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#1A1B4B]">
          <div className="flex-1 bg-[#1A1B4B] rounded-xl px-4 py-3">
            <span className="text-[#475569] text-sm">Describe tu campaña...</span>
          </div>
          <button className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity">
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
