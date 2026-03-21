'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useInView, motion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

/**
 * Componente que anima un número del 0 al valor final
 * cuando el elemento entra en el viewport.
 * Usa Framer Motion useMotionValue y useSpring para suavidad.
 */
export function AnimatedCounter({
  value,
  duration = 2,
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          Intl.NumberFormat('es-LA').format(Math.round(latest)) + suffix
      }
    })
    return unsubscribe
  }, [springValue, suffix])

  return (
    <motion.span ref={ref} className={className}>
      0{suffix}
    </motion.span>
  )
}
