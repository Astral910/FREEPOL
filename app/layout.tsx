import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'FREEPOL — Ecosistema de lealtad con IA',
    template: '%s | FREEPOL',
  },
  description:
    'Crea campañas de puntos, cupones y ruletas sin código. Describe lo que necesitas y la IA lo despliega en WhatsApp, Telegram e Instagram.',
  keywords: [
    'fidelización', 'lealtad', 'IA', 'campañas', 'puntos',
    'cupones', 'WhatsApp', 'Telegram', 'SaaS', 'Guatemala', 'Latinoamérica',
  ],
  authors: [{ name: 'FREEPOL' }],
  creator: 'FREEPOL',
  openGraph: {
    type: 'website',
    locale: 'es_GT',
    url: 'https://freepol.app',
    siteName: 'FREEPOL',
    title: 'FREEPOL — Ecosistema de lealtad con IA',
    description: 'Crea campañas sin código. La IA lo despliega en minutos en todos tus canales.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'FREEPOL — Plataforma de fidelización con IA',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREEPOL — Ecosistema de lealtad con IA',
    description: 'Campañas de fidelización con IA. Sin código. En minutos.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.variable} font-inter antialiased bg-white text-[#0F172A]`}>
        {children}
      </body>
    </html>
  )
}
