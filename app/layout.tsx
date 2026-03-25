import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

/** Tipografía oficial de marca — Sloth (reemplaza Inter en todo el proyecto) */
const sloth = localFont({
  src: [
    {
      path: '../public/fonts/Sloth-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Sloth-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Sloth-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Sloth-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Sloth-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-sloth',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://freepol.app'),
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
    <html lang="es" className={sloth.variable}>
      <body className={`${sloth.variable} font-sans antialiased bg-white text-[#0F172A]`}>
        {children}
      </body>
    </html>
  )
}
