import type { Metadata } from 'next'
import PrivacidadPageClient from './PrivacidadPageClient'

export const metadata: Metadata = {
  title: 'Política de Privacidad — FREEPOL',
  description: 'Cómo FREEPOL recopila, usa y protege los datos de las empresas y sus participantes.',
}

export default function PrivacidadPage() {
  return <PrivacidadPageClient />
}
