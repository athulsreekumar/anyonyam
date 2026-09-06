import type { LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cn('mb-1.5 block font-body text-sm font-medium text-charcoal-900', className)} {...props}>
      {children}
    </label>
  )
}
