import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { CreateMemberModal } from './CreateMemberModal'
import { ToastProvider } from '@/components/molecules/Toast'
import { server } from '@/test/mocks/server'

function renderModal() {
  const onOpenChange = vi.fn()
  const onCreated = vi.fn()
  render(
    <ToastProvider>
      <CreateMemberModal open onOpenChange={onOpenChange} onCreated={onCreated} />
    </ToastProvider>,
  )
  return { onOpenChange, onCreated }
}

describe('CreateMemberModal', () => {
  it('requires name, mobile, and date of birth', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Add Member' }))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Phone number must be exactly 10 digits')).toBeInTheDocument()
  })

  it('creates the member and closes on success', async () => {
    const { onOpenChange, onCreated } = renderModal()
    await userEvent.type(screen.getByLabelText('Name'), 'New Member')
    await userEvent.type(screen.getByLabelText('Mobile'), '9876500001')
    await userEvent.type(screen.getByLabelText('Date of Birth'), '1995-05-05')

    await userEvent.click(screen.getByRole('button', { name: 'Add Member' }))

    expect(await screen.findByText('Member added successfully!')).toBeInTheDocument()
    expect(onCreated).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows a server error without closing the modal', async () => {
    server.use(http.post('http://localhost:8800/newmember', () => HttpResponse.json({ error: 'boom' }, { status: 500 })))
    const { onOpenChange } = renderModal()
    await userEvent.type(screen.getByLabelText('Name'), 'New Member')
    await userEvent.type(screen.getByLabelText('Mobile'), '9876500001')
    await userEvent.type(screen.getByLabelText('Date of Birth'), '1995-05-05')

    await userEvent.click(screen.getByRole('button', { name: 'Add Member' }))

    expect(await screen.findByText('boom')).toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
  })
})
