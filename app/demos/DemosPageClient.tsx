'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, Handshake, Smartphone, ArrowRight, Terminal } from 'lucide-react'
import MarketingChrome from '@/components/marketing/MarketingChrome'
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader'
import { Marquee } from '@/components/ui/Marquee'
import { Sticker } from '@/components/ui/Sticker'

const DEMOS = [
  {
    numero: '01',
    categoria: 'Restaurante',
    empresa: 'Pollo Campero',
    slug: 'sabor-ganador-campero',
    tipo: 'Ruleta',
    descripcion:
      'Campaña mensual gamificada. El cliente valida su correo, gira la ruleta y recibe su código QR único que expira en 24 horas.',
    metricas: ['3 premios', '1 giro por correo', 'QR en 24h'],
    colorTop: '#E8000D',
    icono: Trophy,
    promptChat:
      'Configura la campaña Sabor Ganador para Pollo Campero. Ruleta con 3 premios: 15% descuento (60%), pieza gratis (30%), menú completo (10%). Un giro por correo. Vigente este mes en WhatsApp.',
    prompt: `Configura la campaña "Sabor Ganador" para Pollo Campero. Ruleta con 3 premios: 15% descuento (60%), pieza gratis (30%), menú completo (10%). Un giro por correo. Códigos QR que expiran en 24h. Por WhatsApp e Instagram.`,
    blockClass: 'bg-[#0A0A0A] text-white border border-white/10',
  },
  {
    numero: '02',
    categoria: 'Alianza',
    empresa: 'Walmart + Puma',
    slug: 'eco-puntos-walmart-puma',
    tipo: 'Puntos',
    descripcion:
      'Alianza retail + gasolinera. Factura por Telegram, IA asigna puntos canjeables en combustible.',
    metricas: ['$10 = 1 punto', 'Meta 50 pts', '$5 dto combustible'],
    colorTop: '#0071CE',
    icono: Handshake,
    promptChat:
      'Crea una alianza Walmart-Puma. Los usuarios suben su factura de Walmart por Telegram. Por cada $10 de compra = 1 Eco-Punto. Meta 50 puntos = $5 de descuento en combustible Puma.',
    prompt: `Alianza Walmart + Gasolineras Puma. Los clientes suben su factura de Walmart por Telegram. Por cada $10 de compra = 1 punto. Al llegar a 50 puntos reciben $5 de descuento en combustible.`,
    blockClass: 'bg-[#E8344E] text-white',
  },
  {
    numero: '03',
    categoria: 'E-commerce',
    empresa: "McDonald's Guatemala",
    slug: 'cupones-flash-mcdonalds',
    tipo: 'Cupón',
    descripcion:
      'Cupones flash: código único por persona con deep link a la app.',
    metricas: ['Código único', '72h validez', 'Límite 5.000'],
    colorTop: '#FFC72C',
    icono: Smartphone,
    promptChat:
      "Lanza Cupones Flash para McDonalds. Landing page donde el cliente pone su correo y recibe código único de descuento para un Cuarto de Libra. Botón de deep linking a la app. Máximo 5000 cupones.",
    prompt: `Cupones flash para McDonald's Guatemala desde Instagram. Los clientes ingresan su correo y reciben un código único de Cuarto de Libra gratis. El botón los lleva directo a la app de McDonald's.`,
    blockClass: 'bg-[#1A1B4B] text-white border border-white/10',
  },
] as const

export default function DemosPageClient() {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-[#0A0A0A]">
        <MarketingSubpageHeader subtitle="Demos" />
        <section className="relative overflow-hidden px-4 pb-12 pt-10 md:px-8 md:pt-16">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-[1] mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-block"
            >
              <Sticker rotation={-2} bgColor="#E8344E">
                En vivo
              </Sticker>
            </motion.div>
            <h1 className="text-5xl font-black uppercase leading-none text-white md:text-7xl">
              Demos que{' '}
              <span className="text-[#E8344E]">no mienten</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#94A3B8]">
              Tres tipos de campaña reales. Abre la landing o carga el prompt en el asistente.
            </p>
          </div>
        </section>

        <div className="bg-[#E8344E] py-2">
          <Marquee speed={20} className="font-black uppercase tracking-widest text-white">
            <span>Ruleta</span>
            <span>·</span>
            <span>Puntos</span>
            <span>·</span>
            <span>Cupón</span>
            <span>·</span>
            <span>WhatsApp</span>
            <span>·</span>
            <span>Telegram</span>
            <span>·</span>
          </Marquee>
        </div>

        <main className="mx-auto max-w-6xl space-y-8 px-4 py-14 md:px-8">
          {DEMOS.map((demo, i) => {
            const Icon = demo.icono
            const fromLeft = i % 2 === 0
            return (
              <motion.article
                key={demo.slug}
                initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45 }}
                className={`rounded-3xl p-8 shadow-xl transition-transform hover:scale-[1.01] md:p-10 ${demo.blockClass}`}
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide"
                    style={{ backgroundColor: `${demo.colorTop}33`, color: demo.colorTop }}
                  >
                    Caso {demo.numero}
                  </span>
                  <Icon size={22} className="opacity-80" />
                  <span className="text-sm font-bold opacity-80">{demo.categoria}</span>
                </div>
                <h2 className="text-3xl font-black md:text-4xl">{demo.empresa}</h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider opacity-80">
                  {demo.tipo}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-90">
                  {demo.descripcion}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {demo.metricas.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide opacity-60">
                    <Terminal size={14} />
                    Prompt
                  </div>
                  <div className="rounded-xl border border-[#22C55E]/30 bg-black/40 p-4 font-mono text-xs leading-relaxed text-[#22C55E] md:text-sm">
                    “{demo.prompt}”
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/c/${demo.slug}`}
                    target="_blank"
                    data-cursor="pointer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-center font-black text-[#0A0A0A] hover:brightness-95"
                  >
                    Probar landing <ArrowRight size={18} />
                  </Link>
                  <Link
                    href={`/chat?prompt=${encodeURIComponent(demo.promptChat)}`}
                    data-cursor="pointer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-white/40 px-6 py-4 text-center font-bold hover:bg-white/10"
                  >
                    Abrir en el chat
                  </Link>
                </div>
              </motion.article>
            )
          })}
        </main>

        <section className="bg-[#1A1B4B] px-4 py-16 text-center md:px-8">
          <h2 className="text-3xl font-black text-white md:text-5xl">
            Tu turno: <span className="text-[#E8344E]">sin código</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#94A3B8]">
            Describe tu campaña y la IA la deja lista para WhatsApp y Telegram.
          </p>
          <Link
            href="/chat"
            data-cursor="pointer"
            className="btn-shimmer relative mt-8 inline-flex overflow-hidden rounded-full bg-[#E8344E] px-10 py-5 text-lg font-black text-white"
          >
            Lanzar asistente
          </Link>
        </section>
      </div>
    </MarketingChrome>
  )
}
