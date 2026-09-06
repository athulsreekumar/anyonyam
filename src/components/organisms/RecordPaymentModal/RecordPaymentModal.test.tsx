import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { RecordPaymentModal } from './RecordPaymentModal'
import { ToastProvider } from '@/components/molecules/Toast'
import { server } from '@/test/mocks/server'

const member = { UNIQUEID: 'ANYONYAM3_1', Name: 'Krishnan Namboodiri', MemberNo: 3 }

function renderModal(memberProp: typeof member | null = member) {
  const onOpenChange = vi.fn()
  const onRecorded = vi.fn()
  render(
    <ToastProvider>
      <RecordPaymentModal member={memberProp} onOpenChange={onOpenChange} onRecorded={onRecorded} />
    </ToastProvider>,
  )
  return { onOpenChange, onRecorded }
}

describe('RecordPaymentModal', () => {
  it('renders nothing when there is no member', () => {
    renderModal(null)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the member name and number read-only', () => {
    renderModal()
    expect(screen.getByLabelText('Member')).toHaveValue('Krishnan Namboodiri (No. 3)')
  })

  it('requires a positive amount', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Enter an amount greater than 0')).toBeInTheDocument()
  })

  it('records the payment and closes on success', async () => {
    const { onOpenChange, onRecorded } = renderModal()
    await userEvent.type(screen.getByLabelText('Amount'), '500')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByText('Payment recorded successfully.')).toBeInTheDocument()
    expect(onRecorded).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows the server error when the amount exceeds the balance', async () => {
    server.use(
      http.put('http://localhost:8800/recordPayment', () =>
        HttpResponse.json({ error: 'Amount is greater than the outstanding subscription' }, { status: 400 }),
      ),
    )
    renderModal()
    await userEvent.type(screen.getByLabelText('Amount'), '999999')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Amount is greater than the outstanding subscription')).toBeInTheDocument()
  })
})
