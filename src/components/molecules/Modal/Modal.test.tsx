import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders its title and content when open', () => {
    render(
      <Modal open onOpenChange={() => {}} title="Record a Payment">
        <p>Amount</p>
      </Modal>,
    )
    expect(screen.getByRole('dialog', { name: 'Record a Payment' })).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="Record a Payment">
        <p>Amount</p>
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) when the close button is clicked', async () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange} title="Record a Payment">
        <p>Amount</p>
      </Modal>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
