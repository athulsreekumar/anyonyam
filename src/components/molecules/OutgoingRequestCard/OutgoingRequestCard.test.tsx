import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutgoingRequestCard } from './OutgoingRequestCard'
import type { OutgoingContactRequest } from '@/types/directory'

const base: OutgoingContactRequest = {
  id: 1,
  targetUniqueId: 'ANYONYAM5_1',
  targetName: 'K K Devadas',
  context: 'Found via Profession search: Doctor',
  status: 'pending',
  created_at: '2026-09-06T00:00:00.000Z',
  responded_at: null,
  Mobile: null,
}

describe('OutgoingRequestCard', () => {
  it('shows the context and a pending badge while unresolved', () => {
    render(<OutgoingRequestCard request={base} />)
    expect(screen.getByText('K K Devadas')).toBeInTheDocument()
    expect(screen.getByText('Found via Profession search: Doctor')).toBeInTheDocument()
    expect(screen.getByText('pending')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('reveals a working tel: link once approved', () => {
    render(<OutgoingRequestCard request={{ ...base, status: 'approved', Mobile: '9876543210' }} />)
    expect(screen.getByRole('link', { name: /9876543210/ })).toHaveAttribute('href', 'tel:9876543210')
  })

  it('shows no phone number when rejected', () => {
    render(<OutgoingRequestCard request={{ ...base, status: 'rejected' }} />)
    expect(screen.getByText('rejected')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
