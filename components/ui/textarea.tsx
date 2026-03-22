import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-3 text-sm text-[#E2E8F0] placeholder:text-[#475569] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5B5CF6] focus-visible:border-[#5B5CF6] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
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
