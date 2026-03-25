'use client'

import { type CSSProperties, type ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** Segundos para medio ciclo del loop (dos copias del contenido) */
  speed?: number
  className?: string
  pauseOnHover?: boolean
}

/**
 * Cinta de texto infinita — duplica el contenido y anima con CSS.
 */
export function Marquee({
  children,
  speed = 28,
  className = '',
  pauseOnHover = false,
}: MarqueeProps) {
  const style = {
    ['--marquee-duration' as string]: `${speed}s`,
  } as CSSProperties

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${
        pauseOnHover ? 'group' : ''
      } ${className}`}
    >
      <div
        className={`flex w-max animate-marquee ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={style}
      >
        <div className="flex shrink-0 items-center gap-4 pr-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
