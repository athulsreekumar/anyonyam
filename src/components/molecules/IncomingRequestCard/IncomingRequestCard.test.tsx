import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IncomingRequestCard } from './IncomingRequestCard'
import type { IncomingContactRequest } from '@/types/directory'

const pendingRequest: IncomingContactRequest = {
  id: 1,
  requesterUniqueId: 'ANYONYAM5_1',
  requesterName: 'K K Devadas',
  context: 'Found via Profession search: Doctor',
  status: 'pending',
  created_at: '2026-09-06T00:00:00.000Z',
  responded_at: null,
}

describe('IncomingRequestCard', () => {
  it('renders the requester name and context with Approve/Reject when pending', () => {
    render(<IncomingRequestCard request={pendingRequest} onRespond={async () => {}} />)
    expect(screen.getByText('K K Devadas')).toBeInTheDocument()
    expect(screen.getByText('Found via Profession search: Doctor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument()
  })

  it('calls onRespond(true) when Approve is clicked', async () => {
    const onRespond = vi.fn().mockResolvedValue(undefined)
    render(<IncomingRequestCard request={pendingRequest} onRespond={onRespond} />)
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }))
    expect(onRespond).toHaveBeenCalledWith(true)
  })

  it('calls onRespond(false) when Reject is clicked', async () => {
    const onRespond = vi.fn().mockResolvedValue(undefined)
    render(<IncomingRequestCard request={pendingRequest} onRespond={onRespond} />)
    await userEvent.click(screen.getByRole('button', { name: 'Reject' }))
    expect(onRespond).toHaveBeenCalledWith(false)
  })

  it('shows a status badge instead of buttons once resolved', () => {
    render(<IncomingRequestCard request={{ ...pendingRequest, status: 'approved' }} onRespond={async () => {}} />)
    expect(screen.getByText('approved')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument()
  })
})
