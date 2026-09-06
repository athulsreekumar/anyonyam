import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { NaalukettuBookingsAdminPanel } from './NaalukettuBookingsAdminPanel'
import { renderWithProviders } from '@/test/renderWithProviders'
import { server } from '@/test/mocks/server'
import { pendingBookingFixture } from '@/test/fixtures/booking'

describe('NaalukettuBookingsAdminPanel', () => {
  it('lists a pending booking with its requester, pooja, date and food details', async () => {
    renderWithProviders(<NaalukettuBookingsAdminPanel />)

    expect(await screen.findByText(pendingBookingFixture.pooja_type)).toBeInTheDocument()
    expect(screen.getByText(pendingBookingFixture.requester_name)).toBeInTheDocument()
    expect(screen.getByText(/breakfast for 20/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: pendingBookingFixture.requester_phone })).toBeInTheDocument()
  })

  it('shows a follow-up prompt when no date was requested', async () => {
    server.use(
      http.get('http://localhost:8800/naalukettu/bookings', () =>
        HttpResponse.json({ bookings: [{ ...pendingBookingFixture, event_date: null }] }),
      ),
    )
    renderWithProviders(<NaalukettuBookingsAdminPanel />)
    expect(await screen.findByText(/no date requested/i)).toBeInTheDocument()
  })

  it('approves a pending booking and refetches the list', async () => {
    let fetchCount = 0
    server.use(
      http.get('http://localhost:8800/naalukettu/bookings', () => {
        fetchCount += 1
        return HttpResponse.json({ bookings: fetchCount === 1 ? [pendingBookingFixture] : [] })
      }),
    )
    renderWithProviders(<NaalukettuBookingsAdminPanel />)
    await screen.findByText(pendingBookingFixture.pooja_type)

    await userEvent.click(screen.getByRole('button', { name: 'Approve' }))

    expect(await screen.findByText('No pending booking requests.')).toBeInTheDocument()
  })

  it('switches filters and refetches', async () => {
    renderWithProviders(<NaalukettuBookingsAdminPanel />)
    await screen.findByText(pendingBookingFixture.pooja_type)

    await userEvent.click(screen.getByRole('button', { name: 'Approved' }))

    expect(await screen.findByText('No approved booking requests.')).toBeInTheDocument()
  })
})
