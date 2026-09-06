import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const cardVariants = cva('rounded-lg', {
  variants: {
    surface: {
      raised: 'bg-cream-50 shadow-soft',
      tinted: 'bg-cream-100',
      outlined: 'border border-charcoal-600/15 bg-transparent',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: { surface: 'raised', padding: 'md' },
})

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ surface, padding, className, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ surface, padding }), className)} {...props}>
      {children}
    </div>
  )
}
