import type { Metadata } from 'next'
import GuiaPageClient from './GuiaPageClient'

export const metadata: Metadata = {
  title: 'Guía de Prompts — FREEPOL',
  description: 'Aprende a escribir prompts efectivos para la IA de FREEPOL y crea campañas perfectas en minutos.',
}

export default function GuiaPage() {
  return <GuiaPageClient />
}
