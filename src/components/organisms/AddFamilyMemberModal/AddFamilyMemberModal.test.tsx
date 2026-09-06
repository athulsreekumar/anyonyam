import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddFamilyMemberModal } from './AddFamilyMemberModal'
import { ToastProvider } from '@/components/molecules/Toast'
import { familyMemberFixture } from '@/test/fixtures/member'

function renderModal() {
  const onOpenChange = vi.fn()
  const onAdded = vi.fn()
  render(
    <ToastProvider>
      <AddFamilyMemberModal memberNo={3} open onOpenChange={onOpenChange} onAdded={onAdded} />
    </ToastProvider>,
  )
  return { onOpenChange, onAdded }
}

describe('AddFamilyMemberModal', () => {
  it('shows validation errors for required fields left blank', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Add Member' }))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Relationship is required')).toBeInTheDocument()
  })

  it('submits, calls onAdded, and closes on success', async () => {
    const { onOpenChange, onAdded } = renderModal()
    await userEvent.type(screen.getByLabelText('Name'), familyMemberFixture.Name)
    await userEvent.type(screen.getByLabelText('Relationship'), 'Wife')
    await userEvent.type(screen.getByLabelText('Mobile'), familyMemberFixture.Mobile)
    await userEvent.type(screen.getByLabelText('Date of Birth'), '1980-01-01')

    await userEvent.click(screen.getByRole('button', { name: 'Add Member' }))

    expect(await screen.findByText('Member added!')).toBeInTheDocument()
    expect(onAdded).toHaveBeenCalledWith(expect.objectContaining({ Name: familyMemberFixture.Name }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes without submitting when Cancel is clicked', async () => {
    const { onOpenChange } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
