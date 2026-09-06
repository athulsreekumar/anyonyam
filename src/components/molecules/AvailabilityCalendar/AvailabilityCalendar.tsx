import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/atoms/IconButton'
import { Text } from '@/components/atoms/Text'
import { Spinner } from '@/components/atoms/Spinner'
import { api } from '@/lib/apiClient'
import { cn } from '@/lib/cn'
import type { AvailabilityDay, AvailabilityResponse } from '@/types/naalukettu'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_LABEL = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' })

export interface AvailabilityCalendarProps {
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

/** Local-time YYYY-MM-DD, deliberately not toISOString() - see dbconnection.js's
 * comment on the same UTC-shift bug this app has already hit once. */
function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function AvailabilityCalendar({ selectedDate, onSelectDate }: AvailabilityCalendarProps) {
  const today = useMemo(() => new Date(), [])
  const todayKey = useMemo(() => toDateKey(today), [today])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [days, setDays] = useState<AvailabilityDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const monthParam = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    api
      .get<AvailabilityResponse>('/naalukettu/availability', { params: { month: monthParam } })
      .then((res) => {
        if (!cancelled) setDays(res.data.days)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [monthParam])

  const statusByDate = useMemo(() => new Map(days.map((d) => [d.event_date, d.status])), [days])

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const firstWeekday = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay()

  const cells: Array<{ dateKey: string; day: number } | null> = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ dateKey: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`, day })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <IconButton
          aria-label="Previous month"
          disabled={isCurrentMonth}
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </IconButton>
        <Text className="font-medium">{MONTH_LABEL.format(cursor)}</Text>
        <IconButton
          aria-label="Next month"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </IconButton>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label, i) => (
          <Text key={i} tone="muted" size="sm" className="py-1">
            {label}
          </Text>
        ))}

        {loading ? (
          <div className="col-span-7 flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : error ? (
          <Text tone="muted" size="sm" className="col-span-7 py-8">
            Couldn't load availability. Please try again shortly.
          </Text>
        ) : (
          cells.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} />
            const isPast = cell.dateKey < todayKey
            const status = statusByDate.get(cell.dateKey) ?? 'available'
            const isBlocked = status === 'blocked'
            const isSelected = selectedDate === cell.dateKey
            const disabled = isPast || isBlocked

            return (
              <button
                key={cell.dateKey}
                type="button"
                disabled={disabled}
                title={isBlocked ? (days.find((d) => d.event_date === cell.dateKey)?.note ?? 'Not available') : undefined}
                onClick={() => onSelectDate(cell.dateKey)}
                className={cn(
                  'aspect-square rounded-md text-sm transition-colors duration-150 ease-out',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500',
                  disabled && 'cursor-not-allowed text-charcoal-600/30 line-through',
                  !disabled && !isSelected && 'text-charcoal-900 hover:bg-maroon-100',
                  isSelected && 'bg-maroon-700 text-cream-50',
                )}
              >
                {cell.day}
              </button>
            )
          })
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-maroon-700" aria-hidden />
          <Text tone="muted" size="sm">
            Selected
          </Text>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-charcoal-600/20" aria-hidden />
          <Text tone="muted" size="sm">
            Not available
          </Text>
        </span>
      </div>
    </div>
  )
}
