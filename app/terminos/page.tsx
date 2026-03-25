import type { Metadata } from 'next'
import TerminosPageClient from './TerminosPageClient'

export const metadata: Metadata = {
  title: 'Términos de Servicio — FREEPOL',
  description: 'Términos y condiciones de uso de la plataforma FREEPOL.',
}

export default function TerminosPage() {
  return <TerminosPageClient />
}
