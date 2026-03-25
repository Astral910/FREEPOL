'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StickerProps {
  children: ReactNode
  bgColor?: string
  textColor?: string
  borderClass?: string
  rotation?: number
  className?: string
}

/**
 * Badge tipo sticker con rotación sutil; al hover se endereza y escala.
 */
export function Sticker({
  children,
  bgColor = '#0A0A0A',
  textColor = '#FFFFFF',
  borderClass = 'border-2 border-white',
  rotation = -3,
  className = '',
}: StickerProps) {
  return (
    <motion.span
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-black text-sm uppercase tracking-wide ${borderClass} ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        rotate: rotation,
      }}
      whileHover={{ rotate: 0, scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    >
      {children}
    </motion.span>
  )
}
