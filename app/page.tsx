'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import LogosBar from '@/components/LogosBar'
import PilaresSection from '@/components/PilaresSection'
import PasosSection from '@/components/PasosSection'
import CasosSection from '@/components/CasosSection'
import IAPanel from '@/components/IAPanel'
import CTAFinal from '@/components/CTAFinal'
import Footer from '@/components/Footer'

/**
 * AuthDialog se carga de forma diferida (lazy) para no bloquear
 * el bundle inicial de la página de inicio.
 */
const AuthDialog = dynamic(() => import('@/components/AuthDialog'), {
  ssr: false,
})

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')

  const handleOpenAuth = useCallback((tab: 'login' | 'register' = 'register') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }, [])

  return (
    <main>
      <Navbar onOpenAuth={handleOpenAuth} />
      <HeroSection onOpenAuth={handleOpenAuth} />
      <LogosBar />
      <PilaresSection />
      <PasosSection />
      <CasosSection />
      <IAPanel />
      <CTAFinal onOpenAuth={handleOpenAuth} />
      <Footer />

      {/* Modal de autenticación — cargado de forma diferida */}
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
      />
    </main>
  )
}
