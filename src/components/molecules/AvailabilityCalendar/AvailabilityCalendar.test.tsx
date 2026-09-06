import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AvailabilityCalendar } from './AvailabilityCalendar'

describe('AvailabilityCalendar', () => {
  it('lets the user pick an available day', async () => {
    const onSelectDate = vi.fn()
    render(<AvailabilityCalendar selectedDate={null} onSelectDate={onSelectDate} />)

    await waitFor(() => expect(screen.queryByText(/couldn't load/i)).not.toBeInTheDocument())

    const today = new Date()
    // A day comfortably in the future within the current month, so it's
    // never blocked-by-being-in-the-past regardless of when this test runs.
    const dayInFuture = Math.min(today.getDate() + 1, 27)
    const button = screen.getByRole('button', { name: String(dayInFuture) })
    await userEvent.click(button)

    expect(onSelectDate).toHaveBeenCalled()
  })

  it('disables a day the admin has marked blocked', async () => {
    render(<AvailabilityCalendar selectedDate={null} onSelectDate={vi.fn()} />)
    // Navigate to November 2026, where the shared MSW handler marks the 15th blocked.
    const target = new Date(2026, 10, 1)
    const monthsToAdvance =
      (target.getFullYear() - new Date().getFullYear()) * 12 + (target.getMonth() - new Date().getMonth())
    for (let i = 0; i < monthsToAdvance; i++) {
      await userEvent.click(screen.getByRole('button', { name: 'Next month' }))
    }

    const blockedDay = await screen.findByRole('button', { name: '15' })
    expect(blockedDay).toBeDisabled()
  })
})
