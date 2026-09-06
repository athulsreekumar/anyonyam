import { describe, expect, it } from 'vitest'
import { HttpResponse, http } from 'msw'
import { render, screen, waitFor } from '@testing-library/react'
import { UpcomingEventBanner } from './UpcomingEventBanner'
import { server } from '@/test/mocks/server'
import { eventFixture } from '@/test/fixtures/event'

const BASE = 'http://localhost:8800'

describe('UpcomingEventBanner', () => {
  it('renders the event title, date, and venue once loaded', async () => {
    render(<UpcomingEventBanner />)

    expect(await screen.findByRole('heading', { name: eventFixture.title })).toBeInTheDocument()
    expect(screen.getByText('24 October 2026')).toBeInTheDocument()
    expect(screen.getByText(eventFixture.venue)).toBeInTheDocument()
  })

  it('renders every upcoming event when there is more than one', async () => {
    server.use(
      http.get(`${BASE}/events/upcoming`, () =>
        HttpResponse.json({
          events: [eventFixture, { ...eventFixture, id: 2, title: 'Football Mela', imageIds: [] }],
        }),
      ),
    )
    render(<UpcomingEventBanner />)

    expect(await screen.findByRole('heading', { name: eventFixture.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Football Mela' })).toBeInTheDocument()
  })

  it('shows a friendly empty state when nothing is scheduled', async () => {
    server.use(http.get(`${BASE}/events/upcoming`, () => HttpResponse.json({ events: [] })))
    render(<UpcomingEventBanner />)

    expect(await screen.findByText(/no upcoming events/i)).toBeInTheDocument()
  })

  it('shows the same friendly message when the backend is unreachable', async () => {
    server.use(http.get(`${BASE}/events/upcoming`, () => HttpResponse.error()))
    render(<UpcomingEventBanner />)

    await waitFor(() => expect(screen.getByText(/no upcoming events/i)).toBeInTheDocument())
  })
})
