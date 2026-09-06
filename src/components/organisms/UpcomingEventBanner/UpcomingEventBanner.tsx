import { useEffect, useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { Spinner } from '@/components/atoms/Spinner'
import { api } from '@/lib/apiClient'
import { eventImageUrl } from '@/types/event'
import type { EventItem, EventsResponse } from '@/types/event'

type Status = 'loading' | 'ready' | 'unavailable'

function formatDateLabel(isoDate: string): string {
  // Append a local (non-"Z") time so this parses as local midnight, not UTC
  // midnight - the latter can display as the previous day west of UTC.
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-col gap-6 rounded-lg bg-maroon-700 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
      <div>
        <Badge tone="gold" className="bg-gold-500/20 text-gold-300">
          Upcoming Event
        </Badge>
        <Heading level="h3" className="mt-3 text-cream-50">
          {event.title}
        </Heading>
        <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:gap-6">
          <Text tone="onDark" size="sm" className="flex items-center gap-2 text-cream-50/85">
            <CalendarDays aria-hidden className="h-4 w-4" />
            {formatDateLabel(event.event_date)}
          </Text>
          {event.venue && (
            <Text tone="onDark" size="sm" className="flex items-center gap-2 text-cream-50/85">
              <MapPin aria-hidden className="h-4 w-4" />
              {event.venue}
            </Text>
          )}
        </div>
        {event.description && (
          <Text tone="onDark" size="sm" className="mt-3 max-w-xl text-cream-50/75">
            {event.description}
          </Text>
        )}
      </div>
      {event.imageIds.length > 0 && (
        <ul className="flex gap-2">
          {event.imageIds.slice(0, 4).map((imageId) => (
            <li key={imageId} className="h-20 w-20 shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-24">
              <img
                src={eventImageUrl(imageId)}
                alt={event.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Fetches whatever admins have scheduled via GET /events/upcoming - the
 * backend already filters to event_date >= today, so anything returned
 * here is safe to show as-is (no past events, no client-side date math).
 * Renders nothing but a friendly placeholder when the list is empty or the
 * request fails outright (e.g. the API is unreachable) - either way the
 * visitor sees a calm message instead of a blank gap or a stack trace.
 */
export function UpcomingEventBanner() {
  const [status, setStatus] = useState<Status>('loading')
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    let cancelled = false

    api
      .get<EventsResponse>('/events/upcoming')
      .then(({ data }) => {
        if (cancelled) return
        setEvents(data.events)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {status === 'loading' && (
        <div className="flex justify-center rounded-lg bg-maroon-700 px-6 py-10">
          <Spinner size="md" className="text-cream-50" label="Loading upcoming events" />
        </div>
      )}

      {status === 'unavailable' || (status === 'ready' && events.length === 0) ? (
        <div className="rounded-lg border border-maroon-100 bg-cream-100 px-6 py-10 text-center">
          <Text tone="muted">No upcoming events right now — check back soon!</Text>
        </div>
      ) : null}

      {status === 'ready' && events.length > 0 && (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}
