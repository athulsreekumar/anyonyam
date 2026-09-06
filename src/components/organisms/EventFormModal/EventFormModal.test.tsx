import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { EventFormModal } from './EventFormModal'
import { ToastProvider } from '@/components/molecules/Toast'
import { server } from '@/test/mocks/server'
import { eventFixture } from '@/test/fixtures/event'

function renderModal(event: (typeof eventFixture) | null = null) {
  const onOpenChange = vi.fn()
  const onSaved = vi.fn()
  render(
    <ToastProvider>
      <EventFormModal open onOpenChange={onOpenChange} event={event} onSaved={onSaved} />
    </ToastProvider>,
  )
  return { onOpenChange, onSaved }
}

describe('EventFormModal', () => {
  it('requires a title and a date', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Add Event' }))
    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Date must be in YYYY-MM-DD format')).toBeInTheDocument()
  })

  it('creates an event and closes on success', async () => {
    const { onOpenChange, onSaved } = renderModal()
    await userEvent.type(screen.getByLabelText('Title'), 'Football Mela')
    await userEvent.type(screen.getByLabelText('Date'), '2026-12-01')

    await userEvent.click(screen.getByRole('button', { name: 'Add Event' }))

    expect(await screen.findByText('Event created.')).toBeInTheDocument()
    expect(onSaved).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('pre-fills the form and submits an update when editing', async () => {
    const { onSaved } = renderModal(eventFixture)

    expect(screen.getByLabelText('Title')).toHaveValue(eventFixture.title)
    expect(screen.getByLabelText('Date')).toHaveValue(eventFixture.event_date)

    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Event updated.')).toBeInTheDocument()
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('shows a server error without closing the modal', async () => {
    server.use(http.post('http://localhost:8800/events', () => HttpResponse.json({ error: 'boom' }, { status: 500 })))
    const { onOpenChange } = renderModal()
    await userEvent.type(screen.getByLabelText('Title'), 'Football Mela')
    await userEvent.type(screen.getByLabelText('Date'), '2026-12-01')

    await userEvent.click(screen.getByRole('button', { name: 'Add Event' }))

    expect(await screen.findByText('boom')).toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
  })
})
