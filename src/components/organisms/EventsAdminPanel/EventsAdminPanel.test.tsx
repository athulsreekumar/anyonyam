import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { EventsAdminPanel } from './EventsAdminPanel'
import { ToastProvider } from '@/components/molecules/Toast'
import { server } from '@/test/mocks/server'
import { eventFixture } from '@/test/fixtures/event'
import { api } from '@/lib/apiClient'

const BASE = 'http://localhost:8800'

function renderPanel() {
  return render(
    <ToastProvider>
      <EventsAdminPanel />
    </ToastProvider>,
  )
}

describe('EventsAdminPanel', () => {
  it('lists events fetched from GET /events', async () => {
    renderPanel()
    expect(await screen.findByText(eventFixture.title)).toBeInTheDocument()
    expect(screen.getByText(eventFixture.venue)).toBeInTheDocument()
  })

  it('shows an empty state with no events', async () => {
    server.use(http.get(`${BASE}/events`, () => HttpResponse.json({ events: [] })))
    renderPanel()
    expect(await screen.findByText('No events yet. Add one to get started.')).toBeInTheDocument()
  })

  it('opens the create-event modal from the header button', async () => {
    renderPanel()
    await screen.findByText(eventFixture.title)
    await userEvent.click(screen.getByRole('button', { name: /Add Event/ }))
    expect(await screen.findByRole('dialog', { name: 'Add an Event' })).toBeInTheDocument()
  })

  it('opens the edit modal pre-filled for an existing event', async () => {
    renderPanel()
    await screen.findByText(eventFixture.title)
    await userEvent.click(screen.getByRole('button', { name: `Edit ${eventFixture.title}` }))
    expect(await screen.findByRole('dialog', { name: 'Edit Event' })).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toHaveValue(eventFixture.title)
  })

  it('deletes an event after confirmation', async () => {
    renderPanel()
    await screen.findByText(eventFixture.title)
    await userEvent.click(screen.getByRole('button', { name: `Delete ${eventFixture.title}` }))
    await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))
    expect(await screen.findByText('Event removed.')).toBeInTheDocument()
  })

  it('uploads a photo for an event', async () => {
    // jsdom's FormData/File objects don't survive a real trip through axios
    // + MSW (a well-known interop gap - see ProfileDetailModal.test.tsx).
    // Spying on api.post verifies the right endpoint + file, not the
    // transport layer.
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { message: 'Image added', imageId: 103 } })
    renderPanel()
    await screen.findByText(eventFixture.title)
    const file = new File(['fake-jpeg'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)

    expect(await screen.findByText('Photo added.')).toBeInTheDocument()
    expect(postSpy).toHaveBeenCalledWith(
      `/events/${eventFixture.id}/images`,
      expect.any(FormData),
      expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }),
    )
  })
})
