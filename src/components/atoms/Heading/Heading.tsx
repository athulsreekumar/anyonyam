import type { ElementType, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const headingVariants = cva('font-display text-maroon-900', {
  variants: {
    level: {
      display: 'text-4xl leading-tight font-medium sm:text-5xl md:text-6xl',
      h1: 'text-3xl leading-tight font-medium sm:text-4xl',
      h2: 'text-2xl leading-snug font-medium sm:text-3xl',
      h3: 'text-xl leading-snug font-medium sm:text-2xl',
      h4: 'text-lg leading-snug font-medium',
    },
  },
  defaultVariants: { level: 'h2' },
})

const TAG_FOR_LEVEL: Record<NonNullable<VariantProps<typeof headingVariants>['level']>, ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: ElementType
}

export function Heading({ level = 'h2', as, className, children, ...props }: HeadingProps) {
  const Tag = as ?? TAG_FOR_LEVEL[level ?? 'h2']
  return (
    <Tag className={cn(headingVariants({ level }), className)} {...props}>
      {children}
    </Tag>
  )
}
