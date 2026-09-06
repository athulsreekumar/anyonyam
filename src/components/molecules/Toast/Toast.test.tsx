import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { ToastProvider, useToast } from './Toast'

function Trigger({ message }: { message: string }) {
  const { showToast } = useToast()
  useEffect(() => {
    showToast(message, 'success')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

describe('Toast', () => {
  it('renders a toast raised via showToast', async () => {
    render(
      <ToastProvider>
        <Trigger message="Payment recorded successfully." />
      </ToastProvider>,
    )
    expect(await screen.findByText('Payment recorded successfully.')).toBeInTheDocument()
  })

  it('dismisses when the close control is activated', async () => {
    render(
      <ToastProvider>
        <Trigger message="Member added." />
      </ToastProvider>,
    )
    expect(await screen.findByText('Member added.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByText('Member added.')).not.toBeInTheDocument()
  })

  it('throws when useToast is used outside a provider', () => {
    function Bare() {
      useToast()
      return null
    }
    expect(() => render(<Bare />)).toThrow('useToast must be used within a ToastProvider')
  })
})
