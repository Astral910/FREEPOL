'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Sticker } from '@/components/ui/Sticker'
import { ArrowRight } from 'lucide-react'

/**
 * Casos de uso asimétricos con demos enlazadas.
 */
export default function CasosSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="bg-white px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="relative mb-12 md:mb-16"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -right-2 -top-6 md:right-0 md:top-0">
            <Sticker rotation={-2} bgColor="#0A0A0A" textColor="#FFFFFF">
              Casos reales
            </Sticker>
          </div>
          <h2 className="text-4xl font-black uppercase leading-tight text-[#0A0A0A] md:text-6xl">
            Lo que las empresas
            <br />
            <span className="text-[#E8344E]">están construyendo</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
          <motion.article
            className="flex-1 rounded-3xl border border-[#0A0A0A] bg-[#0A0A0A] p-8 text-white shadow-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl lg:max-w-[58%]"
            initial={{ opacity: 0, x: -48 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <div className="mb-4">
              <Sticker rotation={-3} bgColor="#E8344E" borderClass="border border-white/30">
                Ruleta gamificada
              </Sticker>
            </div>
            <p
              className="mb-4 text-4xl font-black uppercase text-transparent md:text-6xl"
              style={{ WebkitTextStroke: '2px #E8344E' }}
            >
              Pollo Campero
            </p>
            <div className="mb-6 rounded-xl border border-[#22C55E]/40 bg-black p-4 font-mono text-sm leading-relaxed text-[#22C55E]">
              &ldquo;Ruleta con 3 premios, un giro por correo, códigos QR 24h…&rdquo;
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {['60% descuento', '30% pieza gratis', '10% menú'].map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold"
                >
                  {m}
                </span>
              ))}
            </div>
            <Link
              href="/c/sabor-ganador-campero"
              data-cursor="pointer"
              className="inline-flex items-center gap-2 font-black text-[#E8344E] hover:text-[#F2839A]"
            >
              Ver demo en vivo <ArrowRight size={18} />
            </Link>
          </motion.article>

          <motion.article
            className="flex flex-1 flex-col justify-between rounded-3xl bg-[#E8344E] p-8 text-white shadow-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl lg:max-w-[42%]"
            initial={{ opacity: 0, x: 48 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <div>
              <div className="mb-4">
                <Sticker rotation={3} bgColor="#0A0A0A" textColor="#FFFFFF">
                  Puntos por factura
                </Sticker>
              </div>
              <h3 className="mb-3 text-2xl font-black">Walmart + Puma</h3>
              <p className="text-sm font-medium leading-relaxed text-white/90">
                Eco-puntos por factura; suben ticket por Telegram y canjean en combustible.
              </p>
            </div>
            <Link
              href="/c/eco-puntos-walmart-puma"
              data-cursor="pointer"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-black text-[#0A0A0A] hover:brightness-95"
            >
              Ver demo <ArrowRight size={18} />
            </Link>
          </motion.article>
        </div>

        <motion.article
          className="mt-8 rounded-3xl bg-[#1A1B4B] p-8 text-white shadow-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <Sticker rotation={0} bgColor="#E8344E" className="mb-4">
            Cupón + deep link
          </Sticker>
          <h3 className="mb-3 text-2xl font-black md:text-3xl">McDonald&apos;s Guatemala</h3>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-[#94A3B8]">
            Cupones flash desde la landing: correo único, deep link a la app, límite de participantes.
          </p>
          <Link
            href="/c/cupones-flash-mcdonalds"
            data-cursor="pointer"
            className="inline-flex items-center gap-2 font-black text-[#E8344E] hover:text-[#F2839A]"
          >
            Ver demo <ArrowRight size={18} />
          </Link>
        </motion.article>
      </div>
    </section>
  )
}
