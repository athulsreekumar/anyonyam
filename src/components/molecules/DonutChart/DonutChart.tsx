export interface DonutSegment {
  label: string
  value: number
  color: string
}

export interface DonutChartProps {
  data: DonutSegment[]
  centerLabel: string
  formatValue?: (value: number) => string
}

const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 70
const STROKE = 24
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 4

const defaultFormat = (value: number) => value.toLocaleString('en-IN')

/**
 * A hand-rolled SVG donut instead of a charting library - see
 * dataviz skill notes: thin ring, a surface-color gap between segments
 * instead of a border, a legend so identity never depends on color
 * alone, and a center hero total. Renders a neutral empty ring when
 * every value is zero rather than nothing.
 */
export function DonutChart({ data, centerLabel, formatValue = defaultFormat }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  let cursor = 0
  const segments = data.map((d) => {
    const fraction = total > 0 ? d.value / total : 0
    const arc = fraction * CIRCUMFERENCE
    const dash = Math.max(arc - GAP, 0)
    const offset = -cursor
    cursor += arc
    return { ...d, dash, offset, fraction }
  })

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative h-[200px] w-[200px] shrink-0">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" role="img" aria-label={`${centerLabel}: ${formatValue(total)}`}>
          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {total === 0 ? (
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--color-cream-100)" strokeWidth={STROKE} />
            ) : (
              segments.map((s) => (
                <circle
                  key={s.label}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${s.dash} ${CIRCUMFERENCE - s.dash}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="butt"
                />
              ))
            )}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-body text-2xl font-semibold text-maroon-900">{formatValue(total)}</span>
          <span className="font-body text-xs text-charcoal-600">{centerLabel}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 font-body text-sm">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-charcoal-900">{s.label}</span>
            <span className="text-charcoal-600">
              {formatValue(s.value)} ({total > 0 ? Math.round(s.fraction * 100) : 0}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
