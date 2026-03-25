import type { Metadata } from 'next'
import DemosPageClient from './DemosPageClient'

export const metadata: Metadata = {
  title: 'Demos en vivo — FREEPOL',
  description: 'Mira tres campañas reales funcionando: ruleta, puntos por factura y cupón con deep link.',
}

export default function DemosPage() {
  return <DemosPageClient />
}
