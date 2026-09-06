import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { ProfileDetailModal } from './ProfileDetailModal'
import { ToastProvider } from '@/components/molecules/Toast'
import { server } from '@/test/mocks/server'
import { memberFixture } from '@/test/fixtures/member'
import { api } from '@/lib/apiClient'

function renderModal(overrides: Partial<React.ComponentProps<typeof ProfileDetailModal>> = {}) {
  const onOpenChange = vi.fn()
  const onUpdated = vi.fn()
  const onDeleted = vi.fn()
  render(
    <ToastProvider>
      <ProfileDetailModal
        member={memberFixture}
        open
        onOpenChange={onOpenChange}
        canManage
        onUpdated={onUpdated}
        onDeleted={onDeleted}
        {...overrides}
      />
    </ToastProvider>,
  )
  return { onOpenChange, onUpdated, onDeleted }
}

describe('ProfileDetailModal', () => {
  it('shows the member name as the title and personal fields read-only by default', () => {
    renderModal()
    expect(screen.getByRole('dialog', { name: memberFixture.Name })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('readonly')
  })

  it('enables editing after clicking Edit, and Cancel reverts without saving', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).not.toHaveAttribute('readonly')

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Changed Name')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByLabelText('Name')).toHaveValue(memberFixture.Name)
    expect(screen.getByLabelText('Name')).toHaveAttribute('readonly')
  })

  it('renders Blood Group as a select with every blood group, disabled until editing', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('tab', { name: 'Additional Info' }))
    const select = screen.getByLabelText('Blood Group')
    expect(select.tagName).toBe('SELECT')
    expect(select).toBeDisabled()
    expect(within(select).getByRole('option', { name: 'O+' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(select).not.toBeDisabled()

    // memberFixture.BloodGroup is already 'O+' - pick a different value so
    // this actually counts as a change under the diff-only save.
    await userEvent.selectOptions(select, 'A+')
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Profile updated successfully!')).toBeInTheDocument()
  })

  it('only sends the field that actually changed, not the whole form', async () => {
    // react-hook-form hands onSubmit every registered field, not just the
    // one edited. Sending all of them on every save silently rewrote
    // untouched columns (e.g. DOB) with whatever the input currently held -
    // this asserts the payload is a diff, not a full-form resubmit.
    const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ data: { message: 'Member updated' } })
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const nameInput = screen.getByLabelText('Name')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Updated Name')
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Profile updated successfully!')).toBeInTheDocument()
    expect(putSpy).toHaveBeenCalledWith('/member', { UNIQUEID: memberFixture.UNIQUEID, Name: 'Updated Name' })
  })

  it('does not call the API when Save is clicked with no actual changes', async () => {
    const putSpy = vi.spyOn(api, 'put')
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(putSpy).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Name')).toHaveAttribute('readonly')
  })

  it('saves changes and calls onUpdated on valid submit', async () => {
    const { onUpdated } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const nameInput = screen.getByLabelText('Name')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Updated Name')
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Profile updated successfully!')).toBeInTheDocument()
    expect(onUpdated).toHaveBeenCalledWith(expect.objectContaining({ Name: 'Updated Name' }))
  })

  it('shows a validation error and does not submit when Name is cleared', async () => {
    server.use(http.put('http://localhost:8800/member', () => HttpResponse.json({ message: 'should not be called' })))
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.clear(screen.getByLabelText('Name'))
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })

  it('hides edit, delete, and the photo upload form when canManage is false', () => {
    renderModal({ canManage: false })
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Upload photo')).not.toBeInTheDocument()
  })

  it('deletes the member after confirming', async () => {
    const { onDeleted } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    const confirmDialog = await screen.findByRole('dialog', { name: 'Delete this member?' })
    await userEvent.click(within(confirmDialog).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('Member deleted.')).toBeInTheDocument()
    expect(onDeleted).toHaveBeenCalledWith(memberFixture.UNIQUEID)
  })

  it('warns when submitting the photo form with no file selected', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }))
    expect(await screen.findByText('Please select an image to upload.')).toBeInTheDocument()
  })

  it('uploads a selected photo successfully', async () => {
    // jsdom's FormData/File objects don't survive a real trip through
    // axios + MSW (a well-known interop gap, not an app bug - see the
    // adapter note in test/setup.ts). Spying on api.post verifies the
    // component calls the right endpoint with the file attached, without
    // fighting that transport-layer mismatch.
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { message: 'Image updated successfully' } })
    renderModal()
    const file = new File(['fake-image-bytes'], 'photo.jpg', { type: 'image/jpeg' })
    await userEvent.upload(screen.getByLabelText('Upload photo'), file)
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }))

    expect(await screen.findByText('Photo updated successfully.')).toBeInTheDocument()
    expect(postSpy).toHaveBeenCalledWith(
      '/upload',
      expect.any(FormData),
      expect.objectContaining({ params: { UNIQUEID: memberFixture.UNIQUEID } }),
    )
    postSpy.mockRestore()
  })
})
