import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-[#2D2F5E] bg-[#1A1B4B] px-4 py-3 text-sm text-[#E2E8F0] placeholder:text-[#475569] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E8344E] focus-visible:border-[#E8344E] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
