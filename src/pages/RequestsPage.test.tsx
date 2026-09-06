import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { RequestsPage } from './RequestsPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { server } from '@/test/mocks/server'
import { familyMemberFixture, memberFixture } from '@/test/fixtures/member'

describe('RequestsPage', () => {
  it('renders incoming and outgoing requests', async () => {
    renderWithProviders(<RequestsPage />)
    expect(await screen.findByText(familyMemberFixture.Name)).toBeInTheDocument() // incoming
    expect(screen.getByText(memberFixture.Name)).toBeInTheDocument() // outgoing
    expect(screen.getByRole('link', { name: new RegExp(memberFixture.Mobile) })).toBeInTheDocument()
  })

  it('shows empty states when there are none', async () => {
    server.use(
      http.get('http://localhost:8800/contact-requests/incoming', () => HttpResponse.json([])),
      http.get('http://localhost:8800/contact-requests/outgoing', () => HttpResponse.json([])),
    )
    renderWithProviders(<RequestsPage />)
    expect(await screen.findByText("No one has requested your contact details yet.")).toBeInTheDocument()
    expect(screen.getByText("You haven't requested anyone's contact details yet.")).toBeInTheDocument()
  })

  it('approves an incoming request and refetches', async () => {
    renderWithProviders(<RequestsPage />)
    await screen.findByText(familyMemberFixture.Name)

    await userEvent.click(screen.getByRole('button', { name: 'Approve' }))

    expect(await screen.findByText('Request approved.')).toBeInTheDocument()
  })

  it('shows a toast when requests fail to load', async () => {
    server.use(http.get('http://localhost:8800/contact-requests/incoming', () => HttpResponse.json({ error: 'boom' }, { status: 500 })))
    renderWithProviders(<RequestsPage />)
    expect(await screen.findByText("Couldn't load your requests. Please refresh.")).toBeInTheDocument()
  })
})
