import type { ElementType, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const textVariants = cva('font-body', {
  variants: {
    tone: {
      body: 'text-charcoal-900',
      muted: 'text-charcoal-600',
      onDark: 'text-cream-50',
      brand: 'text-maroon-700',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: { tone: 'body', size: 'md' },
})

export interface TextProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: ElementType
}

export function Text({ as: Tag = 'p', tone, size, className, children, ...props }: TextProps) {
  return (
    <Tag className={cn(textVariants({ tone, size }), className)} {...props}>
      {children}
    </Tag>
  )
}
