'use client'

import Link from 'next/link'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { Marquee } from '@/components/ui/Marquee'

const linkGroups = [
  {
    titulo: 'Producto',
    links: [
      { label: 'Cómo funciona', href: '#producto' },
      { label: 'Demos', href: '/demos' },
      { label: 'Precios', href: '/precios' },
    ],
  },
  {
    titulo: 'Recursos',
    links: [
      { label: 'Guía de prompts', href: '/guia' },
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Términos', href: '/terminos' },
    ],
  },
  {
    titulo: 'Compañía',
    links: [
      { label: 'Contacto', href: 'mailto:hola@freepol.app' },
      { label: 'Crear campaña', href: '/chat' },
    ],
  },
]

/**
 * Footer oscuro con logo blend y marquee.
 */
export default function Footer() {
  return (
    <>
      <div className="bg-[#0A0A0A] py-3">
        <Marquee speed={24} className="py-2 font-black uppercase tracking-widest text-[#E8344E]">
          <span>Fideliza</span>
          <span>·</span>
          <span>Automatiza</span>
          <span>·</span>
          <span>Escala</span>
          <span>·</span>
          <span>Sin código</span>
          <span>·</span>
        </Marquee>
      </div>
      <footer className="border-t border-white/10 bg-[#0A0A0A] px-4 py-14 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <Link href="/" className="inline-block">
              <img
                src="/Letras_efecto_fondo_negro.png"
                alt="FREEPOL"
                width={180}
                height={44}
                className="h-10 w-auto mix-blend-screen md:h-11"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm text-[#94A3B8]">
              La forma más rápida de lanzar lealtad con IA en WhatsApp y Telegram.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {linkGroups.map((grupo) => (
              <div key={grupo.titulo}>
                <p className="mb-4 text-xs font-black uppercase tracking-widest text-[#64748B]">
                  {grupo.titulo}
                </p>
                <ul className="space-y-3 text-sm font-semibold">
                  {grupo.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-white/80 transition-colors hover:text-[#E8344E]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-[#64748B]">
                Social
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                  { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { Icon: Github, href: 'https://github.com', label: 'GitHub' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#E8344E] hover:bg-[#E8344E] hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-white/10 pt-8 text-center text-sm text-[#64748B] md:text-left">
            <p>© 2026 FREEPOL. Hecho con ❤️ para Latinoamérica.</p>
            <p className="mt-2 font-semibold text-[#E8344E]">
              Break the limits, connect with other realities.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
