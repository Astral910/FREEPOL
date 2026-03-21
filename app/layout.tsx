import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FREEPOL — Ecosistema de lealtad con IA',
  description:
    'Crea campañas de puntos, cupones y ruletas sin código. Describe lo que necesitas y la IA lo despliega en minutos.',
  keywords:
    'fidelización, lealtad, IA, campañas, puntos, cupones, WhatsApp, Telegram, SaaS',
  authors: [{ name: 'FREEPOL' }],
  openGraph: {
    title: 'FREEPOL — Ecosistema de lealtad con IA',
    description:
      'Crea campañas de puntos, cupones y ruletas sin código. Describe lo que necesitas y la IA lo despliega en minutos.',
    url: 'https://freepol.com',
    siteName: 'FREEPOL',
    type: 'website',
    locale: 'es_LA',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
        width: 1200,
        height: 630,
        alt: 'FREEPOL — Plataforma de fidelización con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREEPOL — Ecosistema de lealtad con IA',
    description:
      'Crea campañas de puntos, cupones y ruletas sin código en minutos.',
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200'],
  },
  robots: {
    index: true,
    follow: true,
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
