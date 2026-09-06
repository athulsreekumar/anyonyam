import type { ReactNode } from 'react'
import { Card } from '@/components/molecules/Card'
import { Text } from '@/components/atoms/Text'

export interface StatCardProps {
  label: string
  value: ReactNode
  caption?: string
}

/**
 * Stat-tile contract: sentence-case label (no trailing colon), a
 * semibold sans value (proportional figures, not tabular - this is a
 * standalone display number, not a column that needs to align), an
 * optional muted caption underneath.
 */
export function StatCard({ label, value, caption }: StatCardProps) {
  return (
    <Card surface="raised">
      <Text tone="muted" size="sm">
        {label}
      </Text>
      <p className="mt-2 font-body text-4xl font-semibold text-maroon-900">{value}</p>
      {caption && (
        <Text tone="muted" size="sm" className="mt-1 tracking-wide uppercase">
          {caption}
        </Text>
      )}
    </Card>
  )
}
