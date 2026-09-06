import type { ReactNode } from 'react'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: ReactNode
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        action && 'sm:flex-row sm:items-end sm:justify-between sm:text-left',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow && (
          <span className="font-body text-xs font-semibold tracking-[0.2em] text-gold-500 uppercase">{eyebrow}</span>
        )}
        <Heading level="h2">{title}</Heading>
        {description && (
          <Text tone="muted" className="max-w-2xl">
            {description}
          </Text>
        )}
      </div>
      {action}
    </div>
  )
}
