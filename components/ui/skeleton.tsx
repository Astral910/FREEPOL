'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#2D2F5E]/50', className)}
      {...props}
    />
  )
}

export { Skeleton }
