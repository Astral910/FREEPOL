'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

interface MarketingChromeProps {
  children: ReactNode
}

/**
 * Barra de progreso de scroll + cursor personalizado (solo desktop).
 * Envuelve páginas de marketing para experiencia unificada.
 */
export default function MarketingChrome({ children }: MarketingChromeProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.2 })

  return (
    <div className="marketing-custom-cursor min-h-screen">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left bg-[#E8344E]"
        style={{ scaleX }}
        aria-hidden
      />
      <CustomCursor />
      {children}
    </div>
  )
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const raf = useRef<number | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [big, setBig] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setEnabled(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = dotRef.current
    if (!el) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.18)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.18)
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${big ? 1.35 : 1})`
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    const hoverable = 'a,button,[role="button"],input[type="submit"],[data-cursor="pointer"]'
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setBig(!!t?.closest(hoverable))
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [enabled, big])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-3 w-3 rounded-full bg-[#E8344E] shadow-[0_0_12px_rgba(232,52,78,0.65)] md:block"
      style={{ willChange: 'transform' }}
      aria-hidden
    />
  )
}
