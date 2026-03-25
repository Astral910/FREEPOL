'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MarketingChrome from '@/components/marketing/MarketingChrome'
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader'

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-black text-[#0A0A0A]">{titulo}</h2>
      <div className="text-[15px] leading-relaxed text-[#374151]">{children}</div>
    </section>
  )
}

export default function TerminosPageClient() {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-[#E8344E]">
        <MarketingSubpageHeader subtitle="Legal" />
        <section className="px-4 py-14 text-center md:px-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-black uppercase text-white md:text-6xl"
          >
            Términos
          </motion.h1>
          <p className="mt-4 text-white/85">Última actualización: Marzo 2026</p>
        </section>
        <main className="mx-auto max-w-3xl px-4 pb-14 md:px-8">
          <div className="rounded-3xl border border-white/20 bg-white p-8 shadow-xl md:p-10">
            <Section titulo="1. Aceptación">
              Al usar FREEPOL aceptas estos términos. Si no estás de acuerdo, no uses el servicio.
            </Section>
            <Section titulo="2. Descripción del servicio">
              FREEPOL es una plataforma SaaS para campañas de fidelización con IA: ruletas, puntos,
              cupones y validación de facturas; despliegue en WhatsApp, Telegram y más canales.
            </Section>
            <Section titulo="3. Uso aceptable">
              <p>Uso permitido: campañas legítimas, datos con consentimiento, análisis propio.</p>
              <p className="mt-3 font-bold">Prohibido:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Spam o comunicaciones no solicitadas.</li>
                <li>Fraude o engaño a participantes.</li>
                <li>Actividades ilegales o acceso no autorizado a otras cuentas.</li>
              </ul>
            </Section>
            <Section titulo="4. Datos y privacidad">
              Consulta la{' '}
              <Link href="/privacidad" className="font-bold text-[#E8344E] hover:underline">
                Política de Privacidad
              </Link>
              .
            </Section>
            <Section titulo="5. Planes y pagos">
              Planes Free, Starter, Pro y Enterprise según lo publicado en /precios. Precios sujetos a
              cambio con aviso.
            </Section>
            <Section titulo="6. Disponibilidad del servicio">
              FREEPOL aspira a alta disponibilidad. Puede haber mantenimientos programados con aviso
              cuando sea posible.
            </Section>
            <Section titulo="7. Limitación de responsabilidad">
              FREEPOL no es responsable de: pérdidas derivadas del uso del servicio, errores en OCR,
              fallos en entrega de correo o interrupciones de terceros (Supabase, WhatsApp, Telegram,
              etc.), dentro de los límites permitidos por la ley aplicable.
            </Section>
            <Section titulo="8. Propiedad intelectual">
              FREEPOL y sus componentes (marca, código, diseño) son propiedad de FREEPOL. Las campañas
              y datos de participantes pertenecen a cada empresa usuaria.
            </Section>
            <Section titulo="9. Cancelación y terminación">
              Puedes cancelar desde el dashboard. Los datos pueden conservarse un período antes de
              eliminación definitiva según la política vigente. El incumplimiento grave puede implicar
              terminación de la cuenta.
            </Section>
            <Section titulo="10. Modificaciones">
              Podemos modificar estos términos; el uso continuado tras la publicación puede implicar
              aceptación según lo dispuesto en cada versión.
            </Section>
            <Section titulo="11. Contacto">
              Consultas legales:{' '}
              <a href="mailto:legal@freepol.app" className="font-bold text-[#E8344E] hover:underline">
                legal@freepol.app
              </a>
            </Section>

            <div className="mt-12 flex flex-wrap gap-6 border-t border-[#E5E7EB] pt-8 text-sm">
              <Link href="/privacidad" className="font-bold text-[#E8344E] hover:underline">
                Privacidad
              </Link>
              <Link href="/precios" className="text-[#64748B] hover:text-[#0F172A]">
                Precios
              </Link>
              <Link href="/" className="text-[#64748B] hover:text-[#0F172A]">
                Inicio
              </Link>
            </div>
          </div>
        </main>
      </div>
    </MarketingChrome>
  )
}
