'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Hook personalizado para animar elementos al hacer scroll.
 * Usa useInView de framer-motion con threshold de 0.1.
 * Las animaciones se ejecutan solo una vez (once: true).
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      },
    },
    stagger: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    staggerItem: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
      },
    },
  }

  return { ref, isInView, variants }
}
