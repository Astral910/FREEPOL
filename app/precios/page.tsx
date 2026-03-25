import type { Metadata } from 'next'
import PreciosPageClient from './PreciosPageClient'

export const metadata: Metadata = {
  title: 'Precios — FREEPOL',
  description: 'Planes Free, Starter, Pro y Enterprise. Empieza gratis y escala tu fidelización con IA.',
}

export default function PreciosPage() {
  return <PreciosPageClient />
}
