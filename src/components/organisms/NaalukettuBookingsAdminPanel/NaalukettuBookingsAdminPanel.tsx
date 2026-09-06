import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarDays, Phone, UtensilsCrossed } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { Text } from '@/components/atoms/Text'
import { Card } from '@/components/molecules/Card'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { useToast } from '@/components/molecules/Toast'
import { api } from '@/lib/apiClient'
import { cn } from '@/lib/cn'
import type { BookingRequest, BookingsResponse, BookingStatus } from '@/types/naalukettu'

const STATUS_TONE = { pending: 'gold', approved: 'success', rejected: 'error' } as const
const FILTERS: Array<{ label: string; value: BookingStatus | 'all' }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
]

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

function formatDateLabel(isoDate: string): string {
  // See the identical helper in EventsAdminPanel - avoids a UTC-midnight
  // parse shifting the displayed day west of UTC.
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function foodLabel(booking: BookingRequest): string {
  if (!booking.food_required) return 'No food requested'
  const meal = booking.meal_type ? booking.meal_type.charAt(0).toUpperCase() + booking.meal_type.slice(1) : 'Meal'
  const cost = booking.estimated_cost ? ` (~₹${Number(booking.estimated_cost)})` : ''
  return `${meal} for ${booking.headcount ?? '?'}${cost}`
}

interface BookingRowProps {
  booking: BookingRequest
  onRespond: (approve: boolean) => Promise<void>
}

function BookingRow({ booking, onRespond }: BookingRowProps) {
  const [responding, setResponding] = useState<'approve' | 'reject' | null>(null)

  async function handle(approve: boolean) {
    setResponding(approve ? 'approve' : 'reject')
    try {
      await onRespond(approve)
    } finally {
      setResponding(null)
    }
  }

  return (
    <Card surface="outlined" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text className="font-medium">
            {booking.pooja_type}
            {booking.member_uniqueid && (
              <Badge tone="maroon" className="ml-2 align-middle">
                Member
              </Badge>
            )}
          </Text>
          <Text tone="muted" size="sm" className="mt-1">
            {booking.requester_name}
          </Text>
        </div>
        <Badge tone={STATUS_TONE[booking.status]} className="capitalize shrink-0">
          {booking.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-4">
        <Text
          tone={booking.event_date ? 'muted' : 'brand'}
          size="sm"
          className="flex items-center gap-1.5"
        >
          <CalendarDays aria-hidden className="h-3.5 w-3.5" />
          {booking.event_date ? formatDateLabel(booking.event_date) : 'No date requested — follow up to pick one'}
        </Text>
        <Text tone="muted" size="sm" className="flex items-center gap-1.5">
          <UtensilsCrossed aria-hidden className="h-3.5 w-3.5" />
          {foodLabel(booking)}
        </Text>
        <a
          href={`tel:${booking.requester_phone}`}
          className="flex items-center gap-1.5 text-sm text-charcoal-600 hover:text-maroon-700"
        >
          <Phone aria-hidden className="h-3.5 w-3.5" />
          {booking.requester_phone}
        </a>
      </div>

      {booking.requester_email && (
        <Text tone="muted" size="sm">
          {booking.requester_email}
        </Text>
      )}

      {booking.status === 'pending' && (
        <div className="flex justify-end gap-2">
          <Button size="sm" intent="ghost" loading={responding === 'reject'} onClick={() => handle(false)}>
            Reject
          </Button>
          <Button size="sm" loading={responding === 'approve'} onClick={() => handle(true)}>
            Approve
          </Button>
        </div>
      )}
    </Card>
  )
}

/**
 * Admin-only queue for public Naalukettu pooja booking requests
 * (POST /naalukettu/bookings needs no login, so this is the only place
 * an admin ever sees them). Approving a booking auto-blocks its date on
 * the availability calendar server-side - see routes/naalukettu.js.
 */
export function NaalukettuBookingsAdminPanel() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BookingStatus | 'all'>('pending')
  const [bookings, setBookings] = useState<BookingRequest[]>([])

  const fetchBookings = useCallback(
    async (status: BookingStatus | 'all') => {
      setLoading(true)
      try {
        const { data } = await api.get<BookingsResponse>('/naalukettu/bookings', {
          params: status === 'all' ? undefined : { status },
        })
        setBookings(data.bookings)
      } catch {
        showToast("Couldn't load booking requests. Please refresh.", 'error')
      } finally {
        setLoading(false)
      }
    },
    [showToast],
  )

  useEffect(() => {
    fetchBookings(filter)
  }, [filter, fetchBookings])

  async function respond(id: number, approve: boolean) {
    try {
      await api.put(`/naalukettu/bookings/${id}/respond`, { approve })
      showToast(approve ? 'Booking approved.' : 'Booking rejected.', 'success')
      fetchBookings(filter)
    } catch (err) {
      showToast(errorMessage(err, 'Failed to respond to this booking.'), 'error')
    }
  }

  return (
    <div>
      <SectionHeading
        title="Naalukettu Booking Requests"
        description="Public pooja booking requests submitted from the Contact page."
      />

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ease-out',
              filter === f.value ? 'bg-maroon-700 text-cream-50' : 'bg-cream-100 text-charcoal-600 hover:bg-maroon-100',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {loading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}
        {!loading && bookings.length === 0 && (
          <Text tone="muted">No {filter === 'all' ? '' : filter} booking requests.</Text>
        )}
        {!loading &&
          bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} onRespond={(approve) => respond(booking.id, approve)} />
          ))}
      </div>
    </div>
  )
}
