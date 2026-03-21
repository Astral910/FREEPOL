import { memo } from 'react'
import Link from 'next/link'
import { Zap, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const columnas = {
  producto: {
    titulo: 'Producto',
    links: [
      'Características',
      'Casos de uso',
      'Precios',
      'Actualizaciones',
      'Roadmap',
    ],
  },
  recursos: {
    titulo: 'Recursos',
    links: [
      'Guía de prompts',
      'Documentación',
      'API Reference',
      'Blog',
      'Comunidad',
    ],
  },
  legal: {
    titulo: 'Legal',
    links: [
      'Términos de servicio',
      'Privacidad',
      'Cookies',
      'Seguridad',
    ],
  },
}

/**
 * Footer de la plataforma con grid de 4 columnas,
 * logo, redes sociales y links de navegación.
 */
const Footer = memo(function Footer() {
  return (
    <footer className="bg-[#0F172A] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Columna Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1.5 mb-4">
              <Zap size={18} className="text-[#5B5CF6]" />
              <span className="text-xl font-bold text-white">
                <span className="text-[#5B5CF6]">FREE</span>POL
              </span>
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs mb-6">
              Plataforma SaaS B2B para crear campañas de fidelización con IA.
              Sin código. Desplegado en WhatsApp, Telegram e Instagram.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/freepol"
                aria-label="Twitter de FREEPOL"
                className="text-[#475569] hover:text-white transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/freepol"
                aria-label="LinkedIn de FREEPOL"
                className="text-[#475569] hover:text-white transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://instagram.com/freepol"
                aria-label="Instagram de FREEPOL"
                className="text-[#475569] hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Columna Producto */}
          <div>
            <h3 className="text-white font-semibold mb-4">{columnas.producto.titulo}</h3>
            <ul className="space-y-3">
              {columnas.producto.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#94A3B8] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Recursos */}
          <div>
            <h3 className="text-white font-semibold mb-4">{columnas.recursos.titulo}</h3>
            <ul className="space-y-3">
              {columnas.recursos.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#94A3B8] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{columnas.legal.titulo}</h3>
            <ul className="space-y-3">
              {columnas.legal.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#94A3B8] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisora */}
        <Separator className="mt-12 bg-[#1E293B]" />

        {/* Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#475569] text-sm">
            © 2025 FREEPOL. Todos los derechos reservados.
          </p>
          <p className="text-[#475569] text-sm">
            Hecho con ❤️ para empresas de Latinoamérica
          </p>
        </div>
      </div>
    </footer>
  )
})

export default Footer
