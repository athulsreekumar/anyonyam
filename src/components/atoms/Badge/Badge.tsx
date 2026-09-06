import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 font-body text-xs font-medium',
  {
    variants: {
      tone: {
        gold: 'bg-gold-500/15 text-gold-500',
        maroon: 'bg-maroon-100 text-maroon-700',
        success: 'bg-success/15 text-success',
        error: 'bg-error/15 text-error',
      },
    },
    defaultVariants: { tone: 'maroon' },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ tone, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {children}
    </span>
  )
}
